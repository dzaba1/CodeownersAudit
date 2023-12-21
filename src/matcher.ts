import { CodeOwnersLine } from "./codeOwnersLine";
import { FileInfoCheck } from "./fileInfoCheck";
import * as path from 'path';
import { Enumerable } from "./enumerable";
import { IO } from "./io";
import { GitIgnore } from "./gitignore";
import { IgnoreWrap } from "./ignoreWrap";
import { FileInfo } from "./fileSystemInfo";

class MatchWorker {
    private readonly gitIgnore?: GitIgnore;

    constructor(private readonly rootDir: string) {
        const gitIgnoreFile = path.join(rootDir, ".gitignore");
        if (IO.fileExists(gitIgnoreFile)) {
            this.gitIgnore = new GitIgnore(gitIgnoreFile);
        }
    }

    public getAllFiles(): Generator<FileInfo> {
        let files = IO.getFiles(this.rootDir, true);
        files = this.filterFiles(files);

        return Enumerable.select(files, f => new FileInfo(f, this.rootDir));
    }

    public filterFiles(files: Generator<string>): Generator<string> {
        let newFiles = Enumerable.where(files, f => !f.includes("\\.git\\"))
        newFiles = Enumerable.where(files, f => !f.includes("/.git/"))

        if (this.gitIgnore) {
            newFiles = Enumerable.where(files, f => !this.gitIgnore!.isIgnored(f));
        }

        return files;
    }

    public filterFileInfos(files: Generator<FileInfo>): Generator<FileInfo> {
        let newFiles = Enumerable.where(files, f => !f.linuxFullName().includes("/.git/"))

        if (this.gitIgnore) {
            newFiles = Enumerable.where(files, f => !this.gitIgnore!.isIgnored(f.fullName));
        }

        return files;
    }
}

export class Matcher {
    constructor() {
    }

    public *matchAllFiles(codeOwners: CodeOwnersLine[], rootDir: string): Generator<FileInfoCheck> {
        const reversedOwners = codeOwners.reverse();
        const worker = new MatchWorker(rootDir);
        const files = worker.getAllFiles();

        for (const file of files) {
            yield this.matchFile(reversedOwners, file);
        }
    }

    private matchFile(codeOwners: CodeOwnersLine[], file: FileInfo): FileInfoCheck {
        console.log("Checking: %s", file.fullName);
        
        for (const codeOwnerLine of codeOwners) {
            const ignore = new IgnoreWrap();
            ignore.add(codeOwnerLine.pattern);

            if (ignore.ignores(file)) {
                return new FileInfoCheck(file, codeOwnerLine);
            }
        }

        return new FileInfoCheck(file);
    }
}