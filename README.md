# img-to-dir

Organize images to Synology Photos Style.

Supported image types: jpeg, jpg, png, heic, heif, tiff, avif

Supported video types: mp4, mov

Synology Photos Style:

- 2024
  - 01
    - IMG_0001.jpg
    - IMG_0002.jpg
    - IMG_0003.jpg
  - 02
    - IMG_0001.jpg
    - IMG_0001.mov

## Requirements

- nodejs

## Options

- ffmpeg (For video, Need to setup environment variables)

## Usage

```console
git clone https://github.com/shinich39/img-to-dir.git
cd ./img-to-dir
npm install
```

1. Put images or directories to "/img-to-dir/input".
2. Enter "npm start" in terminal.
3. Check "/img-to-dir/output"