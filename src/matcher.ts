import { CodeOwnersLine } from "./codeOwnersLine";
import { FileCheck } from "./fileCheck";
import * as path from 'path';
import { Enumerable } from "./enumerable";
import { IO } from "./io";
import { GitIgnore } from "./gitignore";
import { IgnoreWrap } from "./ignoreWrap";
import { FileInfo } from "./fileInfo";

export class Matcher {
    constructor() {

    }

    public *match(codeOwners: CodeOwnersLine[], rootDir: string): Generator<FileCheck> {
        const files = this.getFiles(rootDir);
        const reversedOwners = codeOwners.reverse();

        for (const file of files) {
            yield this.matchFile(reversedOwners, file);
        }
    }

    private getFiles(rootDir: string): Generator<FileInfo> {
        let files = IO.getAllFiles(rootDir);
        files = Enumerable.where(files, f => !f.includes("\\.git\\"))
        files = Enumerable.where(files, f => !f.includes("/.git/"))

        const gitIgnoreFile = path.join(rootDir, ".gitignore");
        if (IO.fileExists(gitIgnoreFile)) {
            const gitIgnore = new GitIgnore(gitIgnoreFile);
            files = Enumerable.where(files, f => !gitIgnore.isIgnored(f));
        }

        return Enumerable.select(files, f => new FileInfo(f, rootDir));
    }

    private matchFile(codeOwners: CodeOwnersLine[], file: FileInfo): FileCheck {
        console.log("Checking: %s", file.fullName);
        
        for (const codeOwnerLine of codeOwners) {
            const ignore = new IgnoreWrap();
            ignore.add(codeOwnerLine.pattern);

            if (ignore.ignores(file)) {
                let currentOwners = codeOwnerLine.owners;
                if (currentOwners && currentOwners.length === 0) {
                    currentOwners = undefined;
                }

                const matchCheck: FileCheck = {
                    filepath: file,
                    pattern: codeOwnerLine.pattern
                }

                if (currentOwners) {
                    matchCheck.owners = currentOwners.join(" ");
                }

                return matchCheck;
            }
        }

        return {
            filepath: file
        }
    }
}