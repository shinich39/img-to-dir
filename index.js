'use strict';

import path from "path";
import fs from "fs";
import exifr from "exifr";
import moment from "moment";
import ffmpeg from "fluent-ffmpeg";
import util from "./libs/util.js";

function chkDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}

function getMetadataFromVideo(srcPath) {
  return new Promise(function(resolve, reject) {
    ffmpeg.ffprobe(srcPath, function(err, metadata) {
      if (err) {
        reject(err);
        return;
      }
      resolve(metadata);
    });
  });
}


function copy(filePath, dirPath) {
  let filename = path.basename(filePath);
  let dstPath = path.join(dirPath, filename);
  let index = 0;
  while(fs.existsSync(dstPath)) {
    index++;
    filename = `${path.basename(filePath, path.extname(filePath))} (${index})${path.extname(filePath)}`;
    dstPath = path.join(dirPath, filename);
  }
  fs.copyFileSync(filePath, dstPath);
}

function readDirs(dirPath) {
  return fs.readdirSync(dirPath).reduce(function(prev, curr) {
    return fs.statSync(path.join(dirPath, curr)).isFile() ? 
      [path.join(dirPath, curr), ...prev] :
      [...prev, ...readDirs(path.join(dirPath, curr))]
  }, []);
}

async function exec(from, to) {
  let files = readDirs(from);
  
  const images = files.filter(function(file) {
    return [".jpeg", ".jpg", ".tiff", ".heif", ".heic", ".avif", ".png"].indexOf(path.extname(file).toLowerCase()) > -1;
  });

  const videos = files.filter(function(file) {
    return [".mov", ".mp4"].indexOf(path.extname(file).toLowerCase()) > -1;
  });

  const errorDir = path.join(to, "error");

  chkDir(to);

  for (const filePath of images) {
    try {
      const buffer = fs.readFileSync(filePath);
      const exif = await exifr.parse(buffer);
      if (!exif) {
        throw new Error("Metadata not found.");
      }
      
      const timestamp = exif.DateTimeOriginal || exif.CreateDate || exif.ModifyDate;
      const createdAt = fs.statSync(filePath).birthtime;
  
      if (!timestamp) {
        throw new Error("Date not found.");
      }

      const date = moment(timestamp);
      const y = date.get("year");
      const m = date.get("month") + 1;
      const d = date.get("date");
      const yearDir = path.join(to, ""+y);
      const monthDir = path.join(to, ""+y, (""+m).padStart(2, "0"));

      chkDir(yearDir);
      chkDir(monthDir);
      copy(filePath, monthDir);
    } catch(err) {
      console.error(err);

      chkDir(errorDir);
      copy(filePath, errorDir);
    }
  }

  for (const filePath of videos) {
    try {
      const metadata = await getMetadataFromVideo(filePath);
      if (!metadata) {
        throw new Error("Metadata not found.");
      }

      const timestamp = metadata.format.tags.creation_time;
      if (!timestamp) {
        throw new Error("Date not found.");
      }

      const date = moment(timestamp);
      const y = date.get("year");
      const m = date.get("month") + 1;
      const d = date.get("date");
      const yearDir = path.join(to, ""+y);
      const monthDir = path.join(to, ""+y, (""+m).padStart(2, "0"));

      chkDir(yearDir);
      chkDir(monthDir);
      copy(filePath, monthDir);
    } catch(err) {
      console.error(err);

      chkDir(errorDir);
      copy(filePath, errorDir);
    }
  }
}

const __module__ = {
  exec,
}

// esm
export default __module__;

// cjs
// module.exports = __module__;

// browser
// window.jsm = __module__;