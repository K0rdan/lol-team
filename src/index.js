import program from "commander";
import { spawn, spawnSync } from "child_process";
import chalk from "chalk";
import stripAnsiStream from "strip-ansi-stream";
import ansiRegex from "ansi-regex";
import { concat, map } from "lodash";

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
      spawn(`docker-compose`, [`-f`, `docker-compose-dev.yml`, `up`, `-d`], {})
    )
  );

program
  .command("run")
  .description("Initialize lolteam docker project with production environment.")
  .action(cmd => listenOn(spawn(`docker-compose`, [`up`, `-d`])));

program
  .command("clean")
  .description("Delete lolteam's docker containers.")
  .action(cmd => {
    // list containers
    const commandRes = spawnSync(`docker`, [`ps`, `-aq`]).output;
    const containersArr = clearResponse(commandRes[1], "clean").split(" ");
    listenOn(spawn(`docker`, concat([`rm`, `-f`], containersArr)));
  });

program.parse(process.argv);
