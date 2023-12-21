import { CodeOwnersParser } from "./codeOwnersParser";
import { Enumerable } from "./enumerable";
import { ExitCode, ExitCodeError } from "./exitCodeError"
import { Matcher } from "./matcher";
import * as path from 'path';
import * as fs from 'fs';

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

        let checks = this.matcher.match([...codeOwnerLines], rootDir);
        if (options.unowned) {
            checks = Enumerable.where(checks, c => c.owners == null);
        }

        if (options.out) {
            let rawCsv = "Filepath,Owners,Pattern\r\n";
            for (const checkedFile of checks) {
                let owners = "";
                if (checkedFile.owners) {
                    owners = `\"${checkedFile.owners}\"`;
                }

                let pattern = "";
                if (checkedFile.pattern) {
                    pattern = `\"${checkedFile.pattern}\"`;
                }

                rawCsv += `\"/${checkedFile.filepath.relativeLinux}\",${owners},${pattern}\r\n`;
            }
            rawCsv = rawCsv.trimEnd();
            fs.writeFileSync(options.out, rawCsv);

        } else {
            for (const checkedFile of checks) {
                console.log("%s: %s", checkedFile.filepath.relativeLinux, checkedFile.owners);
            }
        }
    }
}