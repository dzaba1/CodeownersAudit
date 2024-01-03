import { CodeOwnersLine } from "./codeOwnersLine";
import { FileInfoCheck } from "./fileInfoCheck";
import * as path from 'path';
import { Enumerable } from "./enumerable";
import { IO } from "./io";
import { GitIgnore } from "./gitignore";
import { IgnoreWrap } from "./ignoreWrap";
import { FileInfo } from "./fileSystemInfo";

export class MatchWorker {
    private readonly gitIgnore?: GitIgnore;
    private readonly codeOwners: CodeOwnersLine[];

    constructor(private readonly rootDir: string,
        codeOwners: CodeOwnersLine[]) {
        const gitIgnoreFile = path.join(rootDir, ".gitignore");
        if (IO.fileExists(gitIgnoreFile)) {
            this.gitIgnore = new GitIgnore(gitIgnoreFile);
        }

        this.codeOwners = codeOwners.reverse();
    }

    public getAllFiles(): Generator<FileInfo> {
        const files = IO.getFileInfos(this.rootDir, this.rootDir, true);
        return this.filterFiles(files);
    }

    public filterFiles(files: Generator<FileInfo>): Generator<FileInfo> {
        let newFiles = Enumerable.where(files, f => !f.linuxFullName().includes("/.git/"))

        if (this.gitIgnore) {
            newFiles = Enumerable.where(newFiles, f => !this.gitIgnore!.isIgnored(f.fullName));
        }

        return newFiles;
    }

    public matchFile(file: FileInfo): FileInfoCheck {
        console.log("Checking: %s", file.fullName);
        
        for (const codeOwnerLine of this.codeOwners) {
            const ignore = new IgnoreWrap();
            ignore.add(codeOwnerLine.pattern);

            if (ignore.ignores(file)) {
                return new FileInfoCheck(file, codeOwnerLine);
            }
        }

        return new FileInfoCheck(file);
    }
}

export class Matcher {
    constructor() {
    }

    public *matchAllFiles(codeOwners: CodeOwnersLine[], rootDir: string): Generator<FileInfoCheck> {
        const worker = new MatchWorker(rootDir, codeOwners);
        const files = worker.getAllFiles();

        for (const file of files) {
            yield worker.matchFile(file);
        }
    }
}