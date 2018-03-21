// Lib imports
import program from "commander";
import { spawn, spawnSync } from "child_process";
import stripAnsiStream from "strip-ansi-stream";
import chalk from "chalk";
import { concat, map } from "lodash";
// Custom imports
import { cleanResponse } from "./utils";
import { run, runDev, clean } from "./actions";

const responseHandler = (data, commandName) => {
  console.log(
    `${chalk.green(
      `[LOLTEAM][${commandName.toUpperCase()}][Info]`
    )} ${cleanResponse(data)}`
  );
};

const customListeners = (cmdName, childProcess) => {
  const stream = stripAnsiStream().pipe(childProcess);
  stream.stdout.on("data", data => {
    responseHandler(data, cmdName);
  });
  stream.stderr.on("data", data => {
    responseHandler(data, cmdName);
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
