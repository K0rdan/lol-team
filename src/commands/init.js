// Lib imports
import { spawn, spawnSync } from "child_process";
import { concat } from "lodash";
import chalk from "chalk";
// Custom imports
import cleanVolumes from "./cleanVolumes";
import { streamEventHandler } from "./../utils/index";

/** @function Init
 * @description Initialize lolteam PostgreSQL volume.
 * @param {commandCallback} commandCallback
 * @return {void}.
 */
export const init = commandCallback => {
  const fName = "INIT";

  cleanVolumes("lolteam-db-data");

  const childProcess = spawn(`docker`, [
    `volume`,
    `create`,
    `--name`,
    `lolteam-db-data`
  ]);

  console.log(
    `${chalk.green(
      `[LoLTeam][${fName}][Info] Creating volume for PostgresQL database...`
    )}`
  );
  if (typeof commandCallback === "function") {
    commandCallback(fName, childProcess);
  } else {
    streamEventHandler(fName, childProcess);
  }
};

export default init;
