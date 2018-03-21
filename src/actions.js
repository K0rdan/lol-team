// Lib imports
import { spawn, spawnSync } from "child_process";
import { concat } from "lodash";
import stripAnsiStream from "strip-ansi-stream";
import chalk from "chalk";
// Custom imports
import { cleanResponse } from "./utils";

/** @callback commandCallback Callback function.
 * @param {String} commandName Name of the command
 * @param {ChildProcess} childProcess
 */

/** @function responseHandler
 * @description Function to handle ChildProcess responses in private actions.
 * @access private
 * @return {void}
 */
const responseHandler = (commandName, data) => {
  console.log(
    `${chalk.green(
      `[LOLTEAM][${commandName.toUpperCase()}][Info]`
    )} ${cleanResponse(data)}`
  );
};

/** @function streamEventHandler
 * @description Function to handler ANSI code in ChildProcess' streams.
 * @param {ChildProcess}
 * @param {String}
 * @return {void}
 */
const streamEventHandler = (commandName, childProcess) => {
  const stream = stripAnsiStream().pipe(childProcess);
  stream.stdout.on("data", data => responseHandler(commandName, data));
  stream.stderr.on("data", data => responseHandler(commandName, data));
};

/** @function Run
 * @description Initialize lolteam docker project with production environment.
 * @param {commandCallback} commandCallback
 * @return {ChildProcess} An instance of the class ChildProcess.
 */
export const run = (commandCallback, env = "PROD") => {
  const dockerComposeFiles = {
    DEV: [`-f`, `docker-compose-dev.yml`],
    PROD: []
  };
  clean();
  const childProcess = spawn(
    `docker-compose`,
    concat(dockerComposeFiles[env], [`up`, `-d`])
  );

  if (typeof commandCallback === "function") {
    commandCallback("RUN", childProcess);
  }

  return childProcess;
};

/** @function RunDev
 * @description Initialize lolteam docker project with development environment.
 * @param {commandCallback} commandCallback
 * @return {ChildProcess} An instance of the class ChildProcess.
 */
export const runDev = commandCallback => run(commandCallback, "DEV");

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

export const actions = {
  run,
  runDev,
  clean
};

export default actions;
