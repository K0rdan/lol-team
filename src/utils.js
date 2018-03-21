import ansiRegex from "ansi-regex";

export const cleanResponse = (bufferData, command) =>
  new Buffer(bufferData)
    .toString()
    .replace(/\r/g, "")
    .replace(/\n/g, command === "clean" ? " " : "")
    .replace(ansiRegex(), "")
    .trim();

export const utils = {
  cleanResponse
};

export default utils;
