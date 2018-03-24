import init from "./init";
import clean from "./clean";
import cleanVolumes from "./cleanVolumes";
import run from "./run";
import runDev from "./runDev";

export * from "./init";
export * from "./clean";
export * from "./cleanVolumes";
export * from "./run";
export * from "./runDev";

// GLOBAL TYPEDEF
/** @callback commandCallback Callback function.
 * @param {String} commandName Name of the command
 * @param {ChildProcess} childProcess
 */

export const commands = {
  init,
  clean,
  cleanVolumes,
  run,
  runDev
};

export default commands;
