// Lib imports
import { spawn, spawnSync } from "child_process";
import { concat } from "lodash";
import chalk from "chalk";
// Custom imports
import { cleanResponse, streamEventHandler } from "./../utils/index";

/** @function CleanVolumes
 * @description Delete docker volumes.
 * @param {commandCallback} commandCallback
 * @return {void}.
 */
export const cleanVolumes = (volumeNameFilter, commandCallback) => {
  const fName = "CLEANVOLUMES";

  console.log(
    `${chalk.green(
      `[LoLTeam][${fName}][Info] Searching for existing ${
        volumeNameFilter ? volumeNameFilter : ""
      } volumes ...`
    )}`
  );
  const commandRes = spawnSync(
    `docker`,
    concat(
      [`volume`, `ls`],
      volumeNameFilter ? [`-f`, `name=${volumeNameFilter}`] : [],
      [`-q`]
    )
  ).output[1];

  const dockerVolumesArr = cleanResponse(commandRes, "clean").split(" ");

  console.log(
    `${chalk.green(`[LoLTeam][${fName}][Info] Deleting volumes found ...`)}`
  );
  const childProcess = spawn(
    `docker`,
    concat([`volume`, `rm`, `-f`], dockerVolumesArr)
  );

  if (typeof commandCallback === "function") {
    commandCallback(fName, childProcess);
  } else {
    streamEventHandler(fName, childProcess);
  }
};

export default cleanVolumes;
