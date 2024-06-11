import path from "path";
import fs from "fs";
import ptd from "./index.js";

const INPUT_PATH = path.join(process.cwd(), "input");
const OUTPUT_PATH = path.join(process.cwd(), "output");

ptd.exec(INPUT_PATH, OUTPUT_PATH);