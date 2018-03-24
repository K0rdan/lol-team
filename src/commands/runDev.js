// Custom imports
import { run } from "./run";

/** @function RunDev
 * @description Initialize lolteam docker project with development environment.
 * @param {commandCallback} commandCallback
 * @return {ChildProcess} An instance of the class ChildProcess.
 */
export const runDev = commandCallback => run(commandCallback, "DEV");

export default runDev;
