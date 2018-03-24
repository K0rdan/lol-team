// Lib imports
import ansiRegex from "ansi-regex";

/** @function cleanResponse
 * @description Clean the response Buffer received from the ChildProcess commands' stream.
 * @param {Buffer} bufferData
 * @param {String} command
 */
export const cleanResponse = (bufferData, command) =>
  new Buffer(bufferData)
    .toString()
    .replace(/\r/g, "")
    .replace(/\n/g, command === "clean" ? " " : "")
    .replace(ansiRegex(), "")
    .trim();

export default cleanResponse;
