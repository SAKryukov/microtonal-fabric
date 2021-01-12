# How to capture video from screen and audio, generated by software

This is the solution for Windows:

[Video Screen Capture with Audio](https://www.codeproject.com/Tips/5291304/Video-Screen-Capture-with-Audio)

## Instructions

Download and unpack the latest FFMPeg. Pre-built releases for Windows can be found [on GitHub](https://github.com/BtbN/FFmpeg-Builds/releases).

Locate the file [`video-capture.cmd`](https://SAKryukov.github.io/microtonal-fabric/article/video-production/video-capture.cmd) and save it to the local directory on your Windows system.

Edit `video-capture.cmd`: on the second line, correct the path to "ffmpeg.exe" according to its actual location.

Run `video-capture.cmd` with a file name as a parameter. If there is no parameter, the script will prompt for a file name. It should be a file name (without extension).

After the file name is defined, the script will start recording everything on the screen (including mouse pointer) and sounds from the sound card.

To complete the recording, close the window where `video-capture.cmd` is executed. The video will be recorded in the file .mp4. The codecs uses are AAC and AVC. For production, the file can be transcoded with better compression using more advanced codecs and a container.

By default, the video from a sound card is recorded. To switch to a microphone, see the script and instructions at the bottom part of the script text. Optionally, see the [article](https://www.codeproject.com/Tips/5291304/Video-Screen-Capture-with-Audio). Also, these instructions explain how to use and check up the system settings.

### [Instructions in Russian](instructions.ru.md)