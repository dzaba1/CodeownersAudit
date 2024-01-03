import { CodeOwnersLine } from "./codeOwnersLine";
import { IO } from "./io";

export class CodeOwnersParser {
    public *parse(filename: string) {
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
