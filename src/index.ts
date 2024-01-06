import { Command } from "commander";
import { Engine } from "./engine";
import { ExitCode, ExitCodeError } from "./exitCodeError";
import { CodeOwnersParser } from "./codeOwnersParser";
import { Matcher } from "./matcher";
import { Logging } from "./logging";

const program = new Command();
program
    .version('1.0.0')
    .description("CODEOWNERS checker")
    .option('-c, --codeowners <value>', 'CODEOWNERS file')
    .option('-u, --unowned', 'Unowned files only')
    .option('-o, --out <value>', 'Optional output CSV file.')
    .parse(process.argv);

const options = program.opts();

try {
    const logger = Logging.createDefaultLogger();
    const engine = new Engine(new CodeOwnersParser(logger), new Matcher(logger));
    engine.run({
        codeowners: options.codeowners,
        unowned: options.unowned,
        out: options.out
    });
} catch (error) {
    console.error(error);

    if (error instanceof ExitCodeError) {
        const exError = <ExitCodeError>error;
        if (exError.exitCode === ExitCode.CodeOwnersMissing) {
            program.outputHelp();
        }

        const exitCode: number = exError.exitCode;
        process.exit(exitCode);
    }
    else {
        process.exit(1);
    }
}
