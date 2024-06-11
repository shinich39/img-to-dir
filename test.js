import path from "path";
import fs from "fs";
import itd from "./index.js";

const INPUT_PATH = path.join(process.cwd(), "input");
const OUTPUT_PATH = path.join(process.cwd(), "output");

itd.exec(INPUT_PATH, OUTPUT_PATH);