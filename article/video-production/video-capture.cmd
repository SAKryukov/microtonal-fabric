@echo off
set tool=c:/app/Media/ffmpeg/bin/ffmpeg.exe

set videodelay=00:00:0.6
set framerate=24
set quality=20
set microphone="Microphone (Realtek Audio)"
set mix="Stereo Mix (Realtek Audio)"
set audioChoice=%mix%

set outputFile=%1
:request-file
if "%outputFile%"=="" set /p outputFile=Output file name: 
if "%outputFile%"=="" goto:request-file

%tool% ^
    -f dshow -i audio=%audioChoice% ^
    -f gdigrab -itsoffset %videodelay% -i desktop -c:v libx264rgb ^
        -framerate %framerate% -crf %quality% -preset ultrafast ^
    %outputFile%.mp4

goto:eof

====================================================
Video:

CRF: 0-51, 0 is lossless, 23 default, 51 worse possible quality
Presets:
ultrafast, superfast, veryfast, faster, fast, medium (default), slow, veryslow
common frame rates: 24, 25, 30, 48, 50, 60

Audio, for Windows:

audio="Stereo Mix (Realtek Audio)"
or
audio="Microphone (Realtek Audio)"

The device should be enabled: legacy control panel => Sound => ("Change sound card settings" => Recording) or ("Manage Audio Devices") 

Available dshow devices:
c:/app/Media/ffmpeg/bin/ffmpeg.exe -list_devices true -f dshow -i dummy

