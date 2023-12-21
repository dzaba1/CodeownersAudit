import * as fs from 'fs';
import * as path from 'path';

export module IO {
    export function readLines(filename: string): string[] {
        return fs
            .readFileSync(filename)
            .toString()
            .split(/\r\n|\r|\n/);
    }

    export function *getFiles(dir: string, recurse: boolean): Generator<string> {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory() && recurse) {
                yield* getFiles(path.join(dir, file.name), true);
            } else {
                yield path.join(dir, file.name);
            }
        }
    }

    export function fileExists(file: string): boolean {
        return fs.existsSync(file);
    }
}