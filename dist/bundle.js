#!/usr/bin/env node
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('commander'), require('child_process'), require('chalk'), require('strip-ansi-stream'), require('ansi-regex'), require('lodash')) :
	typeof define === 'function' && define.amd ? define(['commander', 'child_process', 'chalk', 'strip-ansi-stream', 'ansi-regex', 'lodash'], factory) :
	(factory(global.commander,global.child_process,global.chalk,global['strip-ansi-stream'],global['ansi-regex'],global.lodash));
}(this, (function (program,child_process,chalk,stripAnsiStream,ansiRegex,lodash) { 'use strict';

program = program && program.hasOwnProperty('default') ? program['default'] : program;
chalk = chalk && chalk.hasOwnProperty('default') ? chalk['default'] : chalk;
stripAnsiStream = stripAnsiStream && stripAnsiStream.hasOwnProperty('default') ? stripAnsiStream['default'] : stripAnsiStream;
ansiRegex = ansiRegex && ansiRegex.hasOwnProperty('default') ? ansiRegex['default'] : ansiRegex;

const clearResponse = (bufferData, command) =>
  new Buffer(bufferData)
    .toString()
    .replace(/\r/g, "")
    .replace(/\n/g, command === "clean" ? " " : "")
    .replace(ansiRegex(), "")
    .trim();

const responseHandler = data => {
  console.log(`${chalk.green(`[LOLTEAM][Info]`)} ${clearResponse(data)}`);
};

const listenOn = childProcess => {
  const stream = stripAnsiStream().pipe(childProcess);
  stream.stdout.on("data", data => {
    responseHandler(data);
  });
  stream.stderr.on("data", data => {
    responseHandler(data);
  });
};

program
  .command("run-dev")
  .description(
    "Initialize lolteam docker project with development environment."
  )
  .action(cmd =>
    listenOn(
      child_process.spawn(`docker-compose`, [`-f`, `docker-compose-dev.yml`, `up`, `-d`], {})
    )
  );

program
  .command("run")
  .description("Initialize lolteam docker project with production environment.")
  .action(cmd => listenOn(child_process.spawn(`docker-compose`, [`up`, `-d`])));

program
  .command("clean")
  .description("Delete lolteam's docker containers.")
  .action(cmd => {
    // list containers
    const commandRes = child_process.spawnSync(`docker`, [`ps`, `-aq`]).output;
    const containersArr = clearResponse(commandRes[1], "clean").split(" ");
    listenOn(child_process.spawn(`docker`, lodash.concat([`rm`, `-f`], containersArr)));
  });

program.parse(process.argv);

})));
