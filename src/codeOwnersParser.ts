import { Logger } from "winston";
import { CodeOwnersLine } from "./codeOwnersLine";
import { IO } from "./io";

export class CodeOwnersParser {
    constructor(private readonly logger: Logger) {
        
    }

    public *parse(filename: string) {
        this.logger.info("Start parsing %s file.", filename);
        const lines = IO.readLines(filename);

        for (const line of lines) {
            if (!line) {
                continue;
            }

            const trimmed = line.trim();
            if (trimmed === "") {
                continue;
            }

            if (trimmed.startsWith('#')) {
                continue;
            }

            const [pathString, ...usernames] = trimmed.split(/\s+/);
            let currentOwners: string[] | undefined = usernames;
            if (currentOwners && currentOwners.length === 0) {
                currentOwners = undefined;
            }

            yield new CodeOwnersLine(pathString, currentOwners);
        }
    }
}
