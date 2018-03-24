// Lib import
import chalk from "chalk";
import cleanResponse from "./cleanResponse";

/** @function responseHandler
 * @description Function to handle ChildProcess responses in private actions.
 * @access private
 * @return {void}
 */
export const responseHandler = (commandName, data) => {
  const cleanedRes = cleanResponse(data);
  const logLevel = /error/i.test(cleanedRes) ? "red" : "green";
  const logLevelLabel = logLevel === "green" ? "Info" : "Error";
  console.log(
    `${chalk[logLevel](
      `[LOLTEAM][${commandName.toUpperCase()}][${logLevelLabel}]`
    )} ${cleanedRes}`
  );
};

export default responseHandler;
