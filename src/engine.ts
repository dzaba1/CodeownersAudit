import { CodeOwnersParser } from "./codeOwnersParser";
import { Enumerable } from "./enumerable";
import { ExitCode, ExitCodeError } from "./exitCodeError"
import { Matcher } from "./matcher";
import * as path from 'path';
import * as fs from 'fs';
import { FileInfoCheck } from "./fileInfoCheck";

export interface ProgramOptions {
    codeowners?: string,
    out?: string,
    unowned?: boolean
}

export class Engine {
    constructor(private readonly parser: CodeOwnersParser,
        private readonly matcher: Matcher) {

    }

    public run(options: ProgramOptions) {
        if (!options.codeowners) {
            throw new ExitCodeError("CODEOWNERS file is required.", ExitCode.CodeOwnersMissing);
        }

        const codeOwnerLines = this.parser.parse(options.codeowners);
        const rootDir = path.dirname(options.codeowners);

        let checks = this.matcher.matchAllFiles([...codeOwnerLines], rootDir);
        if (options.unowned) {
            checks = Enumerable.where(checks, c => c.ownersLine?.owners == null);
        }

        if (options.out) {
            let rawCsv = "Filepath,Owners,Pattern\r\n";
            for (const checkedFile of checks) {
                rawCsv += this.toCsvLine(checkedFile);
            }
            rawCsv = rawCsv.trimEnd();
            fs.writeFileSync(options.out, rawCsv);

        } else {
            for (const checkedFile of checks) {
                console.log("/%s: %s", checkedFile.fileOrDir.relativeLinux(), checkedFile.ownersLine?.displayOwners());
            }
        }
    }

    private toCsvLine(checkedFile: FileInfoCheck): string {
        let owners = "";
        const currentOwners = checkedFile.ownersLine?.displayOwners();

        if (currentOwners) {
            owners = `\"${currentOwners}\"`;
        }

        let pattern = "";
        const currentPattern = checkedFile.ownersLine?.pattern;
        if (currentPattern) {
            pattern = `\"${currentPattern}\"`;
        }

        return `\"/${checkedFile.fileOrDir.relativeLinux()}\",${owners},${pattern}\r\n`;
    }
}