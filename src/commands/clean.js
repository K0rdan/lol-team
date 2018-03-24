// Lib imports
import { spawn, spawnSync } from "child_process";
import { concat } from "lodash";
// Custom imports
import { cleanResponse } from "./../utils/cleanResponse";
import { streamEventHandler } from "./../utils/streamEventHandler";

/** @function Clean
 * @description Delete lolteam docker containers.
 * @param {commandCallback} commandCallback
 * @return {void}.
 */
export const clean = commandCallback => {
  const commandRes = spawnSync(`docker`, [`ps`, `-aq`]).output[1];
  const containersArr = cleanResponse(commandRes, "clean").split(" ");
  const childProcess = spawn(`docker`, concat([`rm`, `-f`], containersArr));

  if (typeof commandCallback === "function") {
    commandCallback("CLEAN", childProcess);
  } else {
    streamEventHandler("CLEAN", childProcess);
  }
};

export default clean;
