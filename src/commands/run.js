// Lib imports
import { spawn } from "child_process";
import { concat } from "lodash";
// Custom imports
import { clean } from "./clean";

/** @function Run
 * @description Initialize lolteam docker project with production environment.
 * @param {commandCallback} commandCallback
 * @param {string} env Environment variable of Docker project.
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

export default run;
