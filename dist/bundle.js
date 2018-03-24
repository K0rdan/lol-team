#!/usr/bin/env node
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('ansi-regex'), require('chalk'), require('strip-ansi-stream'), require('child_process'), require('lodash'), require('commander')) :
	typeof define === 'function' && define.amd ? define(['ansi-regex', 'chalk', 'strip-ansi-stream', 'child_process', 'lodash', 'commander'], factory) :
	(factory(global['ansi-regex'],global.chalk,global['strip-ansi-stream'],global.child_process,global.lodash,global.commander));
}(this, (function (ansiRegex,chalk,stripAnsiStream,child_process,lodash,program) { 'use strict';

ansiRegex = ansiRegex && ansiRegex.hasOwnProperty('default') ? ansiRegex['default'] : ansiRegex;
chalk = chalk && chalk.hasOwnProperty('default') ? chalk['default'] : chalk;
stripAnsiStream = stripAnsiStream && stripAnsiStream.hasOwnProperty('default') ? stripAnsiStream['default'] : stripAnsiStream;
program = program && program.hasOwnProperty('default') ? program['default'] : program;

// Lib imports

/** @function cleanResponse
 * @description Clean the response Buffer received from the ChildProcess commands' stream.
 * @param {Buffer} bufferData
 * @param {String} command
 */
const cleanResponse = (bufferData, command) =>
  new Buffer(bufferData)
    .toString()
    .replace(/\r/g, "")
    .replace(/\n/g, command === "clean" ? " " : "")
    .replace(ansiRegex(), "")
    .trim();

// Lib import

/** @function responseHandler
 * @description Function to handle ChildProcess responses in private actions.
 * @access private
 * @return {void}
 */
const responseHandler = (commandName, data) => {
  const cleanedRes = cleanResponse(data);
  const logLevel = /error/i.test(cleanedRes) ? "red" : "green";
  const logLevelLabel = logLevel === "green" ? "Info" : "Error";
  console.log(
    `${chalk[logLevel](
      `[LOLTEAM][${commandName.toUpperCase()}][${logLevelLabel}]`
    )} ${cleanedRes}`
  );
};

// Lib imports

/** @function streamEventHandler
 * @description Function used to add default listeners in ChildProcess' streams.
 * @param {String} commandName
 * @param {ChildProcess} childProcess
 * @return {void}
 */
const streamEventHandler = (commandName, childProcess) => {
  const stream = stripAnsiStream().pipe(childProcess);
  stream.stdout.on("data", data => responseHandler(commandName, data));
  stream.stderr.on("data", data => responseHandler(commandName, data));
};

// Lib imports

/** @function CleanVolumes
 * @description Delete docker volumes.
 * @param {commandCallback} commandCallback
 * @return {void}.
 */
const cleanVolumes = (volumeNameFilter, commandCallback) => {
  const fName = "CLEANVOLUMES";

  console.log(
    `${chalk.green(
      `[LoLTeam][${fName}][Info] Searching for existing ${
        volumeNameFilter ? volumeNameFilter : ""
      } volumes ...`
    )}`
  );
  const commandRes = child_process.spawnSync(
    `docker`,
    lodash.concat(
      [`volume`, `ls`],
      volumeNameFilter ? [`-f`, `name=${volumeNameFilter}`] : [],
      [`-q`]
    )
  ).output[1];

  const dockerVolumesArr = cleanResponse(commandRes, "clean").split(" ");

  console.log(
    `${chalk.green(`[LoLTeam][${fName}][Info] Deleting volumes found ...`)}`
  );
  const childProcess = child_process.spawn(
    `docker`,
    lodash.concat([`volume`, `rm`, `-f`], dockerVolumesArr)
  );

  if (typeof commandCallback === "function") {
    commandCallback(fName, childProcess);
  } else {
    streamEventHandler(fName, childProcess);
  }
};

// Lib imports

/** @function Init
 * @description Initialize lolteam PostgreSQL volume.
 * @param {commandCallback} commandCallback
 * @return {void}.
 */
const init = commandCallback => {
  const fName = "INIT";

  cleanVolumes("lolteam-db-data");

  const childProcess = child_process.spawn(`docker`, [
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

// Lib imports

/** @function Clean
 * @description Delete lolteam docker containers.
 * @param {commandCallback} commandCallback
 * @return {void}.
 */
const clean = commandCallback => {
  const commandRes = child_process.spawnSync(`docker`, [`ps`, `-aq`]).output[1];
  const containersArr = cleanResponse(commandRes, "clean").split(" ");
  const childProcess = child_process.spawn(`docker`, lodash.concat([`rm`, `-f`], containersArr));

  if (typeof commandCallback === "function") {
    commandCallback("CLEAN", childProcess);
  } else {
    streamEventHandler("CLEAN", childProcess);
  }
};

// Lib imports

/** @function Run
 * @description Initialize lolteam docker project with production environment.
 * @param {commandCallback} commandCallback
 * @param {string} env Environment variable of Docker project.
 * @return {ChildProcess} An instance of the class ChildProcess.
 */
const run = (commandCallback, env = "PROD") => {
  const dockerComposeFiles = {
    DEV: [`-f`, `docker-compose-dev.yml`],
    PROD: []
  };
  clean();
  const childProcess = child_process.spawn(
    `docker-compose`,
    lodash.concat(dockerComposeFiles[env], [`up`, `-d`])
  );

  if (typeof commandCallback === "function") {
    commandCallback("RUN", childProcess);
  }

  return childProcess;
};

// Custom imports

/** @function RunDev
 * @description Initialize lolteam docker project with development environment.
 * @param {commandCallback} commandCallback
 * @return {ChildProcess} An instance of the class ChildProcess.
 */
const runDev = commandCallback => run(commandCallback, "DEV");

// Lib imports

const responseHandler$1 = (data, commandName) => {
  console.log(
    `${chalk.green(
      `[LOLTEAM][${commandName.toUpperCase()}][Info]`
    )} ${cleanResponse(data)}`
  );
};

const customListeners = (cmdName, childProcess) => {
  const stream = stripAnsiStream().pipe(childProcess);
  stream.stdout.on("data", data => {
    responseHandler$1(data, cmdName);
  });
  stream.stderr.on("data", data => {
    responseHandler$1(data, cmdName);
  });
};

// INIT
program
  .command("init")
  .description("Initialize lolteam docker project.")
  .action(cmd => init());

// RUN
program
  .command("run")
  .description("Initialize lolteam docker project with production environment.")
  .action(cmd => run(customListeners));

// RUN-DEV
program
  .command("run-dev")
  .description(
    "Initialize lolteam docker project with development environment."
  )
  .action(cmd => runDev(customListeners));

// CLEAN
program
  .command("clean")
  .description("Delete lolteam's docker containers.")
  .action(cmd => clean(customListeners));

program.parse(process.argv);

})));
