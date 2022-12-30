import chalk from 'chalk';
import { program } from 'commander';
import creator from "./create.mjs";
program
    .command("create <project>")
    .description("electron+vue3脚手架")
    .action(creator)
program
  .configureOutput({
    // Visibly override write routines as example!
    writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
    writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
    // Highlight errors in color.
    outputError: (str, write) => write(chalk.redBright(str))
  });

program.parse(process.argv);
