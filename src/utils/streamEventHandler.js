// Lib imports
import stripAnsiStream from "strip-ansi-stream";
import responseHandler from "./responseHandler";

/** @function streamEventHandler
 * @description Function used to add default listeners in ChildProcess' streams.
 * @param {String} commandName
 * @param {ChildProcess} childProcess
 * @return {void}
 */
export const streamEventHandler = (commandName, childProcess) => {
  const stream = stripAnsiStream().pipe(childProcess);
  stream.stdout.on("data", data => responseHandler(commandName, data));
  stream.stderr.on("data", data => responseHandler(commandName, data));
};

export default streamEventHandler;
