"use strict";

function WebAudioFontPlayer() {

    const envelopes = new Set();
    this.cancelQueue = function (audioContext) {
        for (let envelopeEntry of envelopes.entries())
            envelopeEntry[0].cancel();
        envelopes.clear();
    }; //cancelQueue
    
    const createEnvelope = function (audioContext, target, zone, volume, when, sampleDuration, noteDuration) {
        const envelope = audioContext.createGain();
        envelope.noDuration = (noteDuration != undefined && noteDuration.constructor == Boolean);
        if (envelope.noDuration)
            noteDuration = 1;
        envelope.target = target;
        envelope.connect(target);
        setupCancel(envelope);
        envelopes.add(envelope);
        // setup:
        envelope.gain.setValueAtTime(0, audioContext.currentTime);
        let lastTime = 0;
        let lastVolume = 0;
        let duration = noteDuration;
        let ahdsr = zone.ahdsr;
        if (ahdsr) {
            if (!(ahdsr.length > 0)) {
                ahdsr = [{
                    duration: 0,
                    volume: 1
                }, {
                    duration: 0.5,
                    volume: 1
                }, {
                    duration: 1.5,
                    volume: 0.5
                }, {
                    duration: 3,
                    volume: 0
                }
                ];
            }
        } else {
            ahdsr = [{
                duration: 0,
                volume: 1
            }, {
                duration: duration,
                volume: 1
            }
            ];
        } //if ahdsr
        envelope.gain.cancelScheduledValues(when);
        envelope.gain.setValueAtTime(ahdsr[0].volume * volume, when);
        for (let i = 0; i < ahdsr.length; i++) {
            if (ahdsr[i].duration > 0) {
                if (ahdsr[i].duration + lastTime > duration) {
                    const r = 1 - (ahdsr[i].duration + lastTime - duration) / ahdsr[i].duration;
                    const n = lastVolume - r * (lastVolume - ahdsr[i].volume);
                    envelope.gain.linearRampToValueAtTime(volume * n, when + duration);
                    break;
                }
                lastTime = lastTime + ahdsr[i].duration;
                lastVolume = ahdsr[i].volume;
                envelope.gain.linearRampToValueAtTime(volume * lastVolume, when + lastTime);
            }
        }
        if (!envelope.noDuration)
            envelope.gain.linearRampToValueAtTime(0, when + duration);
        return envelope;
    }; //createEnvelope

    const numValue = function (aValue, defValue) {
        if (aValue == 0 || (aValue && aValue.constructor == Number))
            return aValue;
        else
            return defValue;
    }; //numValue

    this.adjustPreset = function (audioContext, preset) {
        if (!preset) return;
        if (preset.constructor == String) return;
        const fixedZones = [];
        for (let zone of preset.zones) {
            if (zone.keyRangeLow > zone.keyRangeHigh) continue; // pathological case, not used anyway
            fixedZones.push(zone);
            adjustZone(audioContext, zone);
        } //loop preset.zones
        preset.zones = fixedZones;
        // removing 1-semitone gaps between zones; important for microtones:
        for (let index = 1; index < preset.zones.length; ++index)
            preset.zones[index].keyRangeLow = preset.zones[index - 1].keyRangeHigh;
    }; //adjustPreset

    const createBuffer = function (audioContext, source, sampleRate) {
        const buffer = audioContext.createBuffer(1, source.length / 2, sampleRate);
        const samples = buffer.getChannelData(0);
        for (let index = 0; index < source.length / 2; index++) {
            let word = source.charCodeAt(index * 2) | (source.charCodeAt(index * 2 + 1) << 8);
            if (word >= 0x10000 / 2) word -= 0x10000;
            samples[index] = word / 0x10000;
        } //loop
        return buffer;
    }; //createBuffer

    const zoneBufferFromFile = function (audioContext, source, zone) {
        const ab = new ArrayBuffer(source.length);
        const view = new Uint8Array(ab);
        for (let index = 0; index < source.length; index++)
            view[index] = source.charCodeAt(index);
        audioContext.decodeAudioData(ab).then(function (audioBuffer) {
            zone.buffer = audioBuffer;
            if (zone.anchor) {
                const float32Array = audioBuffer.getChannelData(0);
                let max = 0;
                let indexAtMax = 0;
                for (let index = 0; index < float32Array.length; index++)
                    if (float32Array[index] > max) {
                        max = float32Array[index];
                        indexAtMax = index;
                    } //if
                zone.delay = indexAtMax / audioBuffer.sampleRate - zone.anchor;
                if (zone.delay < 0)
                    zone.delay = 0;
            } //if
        }); //audioContext.decodeAudioData
    }; //zoneBufferFromFile

    const adjustZone = function (audioContext, zone) {
        if (!zone.buffer) {
            zone.delay = 0;
            if (zone.sample)
                zone.buffer = createBuffer(audioContext, atob(zone.sample), zone.sampleRate);
            else if (zone.file)
                zoneBufferFromFile(audioContext, atob(zone.file), zone);
        } // if !zone.buffer
        zone.loopStart = numValue(zone.loopStart, 0);
        zone.loopEnd = numValue(zone.loopEnd, 0);
        zone.coarseTune = numValue(zone.coarseTune, 0);
        zone.fineTune = numValue(zone.fineTune, 0);
        zone.originalPitch = numValue(zone.originalPitch, 6000);
        zone.sampleRate = numValue(zone.sampleRate, 44100);
        zone.sustain = numValue(zone.originalPitch, 0);
    }; //adjustZone

    const findZone = function (audioContext, preset, pitch) {
        let zone = null;
        for (let index = preset.zones.length - 1; index >= 0; index--) {
            zone = preset.zones[index];
            if (zone.keyRangeLow <= pitch && zone.keyRangeHigh >= pitch) break;
        } //loop
        adjustZone(audioContext, zone);
        return zone;
    }; //findZone

    function setupCancel(envelope) {
        envelope.cancel = function (cancellingQueue) {
            if (!cancellingQueue)
                envelopes.delete(this);
            this.source.stop();
            this.source.disconnect();
            this.disconnect();
        }; //envelope.cancel
    } //setupCancel

    const startWaveForm = function (audioContext, target, waveForm, when, pitch, duration, volume) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.gainNode = gainNode;
        oscillator.connect(gainNode);
        gainNode.connect(target);
        oscillator.type = waveForm; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
        oscillator.frequency.value = 27.5 * Math.pow(2, (pitch - 21) / 12);
        gainNode.gain.value = volume;
        setupCancel(gainNode);
        gainNode.source = oscillator;
        let noDuration = (duration != undefined && duration.constructor == Boolean);
        let startWhen = when;
        if (startWhen < audioContext.currentTime)
            startWhen = audioContext.currentTime;
        oscillator.start(startWhen);
        if (!noDuration)
            oscillator.stop(startWhen + duration);
        oscillator.onended = function (event) {
            event.target.gainNode.cancel();
        }; //oscillator.onended
        envelopes.add(gainNode);
        return gainNode;
    } //startWaveForm

    this.startNote = function (audioContext, target, preset, when, pitch, duration, volume, slides) {
        if (volume)
            volume = 1.0 * volume;
        else
            volume = 1.0;
        if (!preset)
            preset = "sine";
        if (preset.constructor == String)
            return startWaveForm(audioContext, target, preset, when, pitch, duration, volume);
        const zone = findZone(audioContext, preset, pitch);
        if (!(zone.buffer)) {
            console.log('empty buffer ', zone);
            return;
        } //if
        const baseDetune = zone.originalPitch - 100.0 * zone.coarseTune - zone.fineTune;
        const playbackRate = Math.pow(2, (100.0 * pitch - baseDetune) / 1200.0);
        const sampleRatio = zone.sampleRate / audioContext.sampleRate;
        let startWhen = when;
        if (startWhen < audioContext.currentTime)
            startWhen = audioContext.currentTime;
        const waveDuration = duration;
        let loop = true;
        if (zone.loopStart < 1 || zone.loopStart >= zone.loopEnd)
            loop = false;
        if (!loop)
            if (waveDuration > zone.buffer.duration / playbackRate)
                waveDuration = zone.buffer.duration / playbackRate;
        const envelope = createEnvelope(audioContext, target, zone, volume, startWhen, waveDuration, duration);
        envelope.source = audioContext.createBufferSource();
        envelope.source.envelope = envelope;
        envelope.source.onended = function (event) {
            event.target.envelope.cancel();
        }; //oscillator.onended
        envelope.source.playbackRate.value = playbackRate;
        if (slides && slides.length > 0) {
            envelope.source.playbackRate.setValueAtTime(playbackRate, when);
            for (let slide of slides) {
                const newPlaybackRate = 1.0 * Math.pow(2, (100.0 * slide.pitch - baseDetune) / 1200.0);
                const newWhen = when + slide.when;
                envelope.source.playbackRate.linearRampToValueAtTime(newPlaybackRate, newWhen);
            } //loop
        } //if
        envelope.source.buffer = zone.buffer;
        if (loop) {
            envelope.source.loop = true;
            envelope.source.loopStart = zone.loopStart / zone.sampleRate + zone.delay;
            envelope.source.loopEnd = zone.loopEnd / zone.sampleRate + zone.delay;
        } else
            envelope.source.loop = false;
        envelope.source.connect(envelope);
        envelope.source.start(startWhen, zone.delay);
        if (!envelope.noDuration)
            envelope.source.stop(startWhen + waveDuration);
        envelope.when = startWhen;
        envelope.duration = waveDuration;
        envelope.pitch = pitch;
        envelope.preset = preset;
        return envelope;
    }; //startNote

    return this;

} //WebAudioFontPlayer constructor

if (typeof module === typeof {} && module.exports)
    module.exports = WebAudioFontPlayer;
