import { CodeOwnersLine } from "./codeOwnersLine";
import { IO } from "./io";

export class CodeOwnersParser {
    public *parse(filename: string) {
        const lines = IO.readLines(filename);

        for (const line of lines) {
            if (!line) {
                continue;
            }

            if (line.startsWith('#')) {
                continue;
            }

            const [pathString, ...usernames] = line.split(/\s+/);
            let currentOwners: string[] | undefined = usernames;
            if (currentOwners && currentOwners.length === 0) {
                currentOwners = undefined;
            }

            yield new CodeOwnersLine(pathString, currentOwners);
        }
    }
}
