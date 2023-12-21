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
            const lineParsed: CodeOwnersLine = {
                pattern: pathString,
                owners: usernames
            };

            yield lineParsed;
        }
    }
}
