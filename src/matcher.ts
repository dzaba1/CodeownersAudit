import { CodeOwnersLine } from "./codeOwnersLine";
import { FileInfoCheck } from "./fileInfoCheck";
import * as path from 'path';
import { Enumerable } from "./enumerable";
import { IO } from "./io";
import { GitIgnore } from "./gitignore";
import { IgnoreWrap } from "./ignoreWrap";
import { FileInfo } from "./fileSystemInfo";
import { Logger } from "winston";

export class MatchWorker {
    private readonly gitIgnore?: GitIgnore;
    private readonly codeOwners: CodeOwnersLine[];

    constructor(private readonly rootDir: string,
        private readonly logger: Logger,
        codeOwners: CodeOwnersLine[]) {

        const gitIgnoreFile = path.join(rootDir, ".gitignore");
        if (IO.fileExists(gitIgnoreFile)) {
            this.gitIgnore = new GitIgnore(gitIgnoreFile, this.logger);
        }

        this.codeOwners = codeOwners.reverse();
    }

    public getAllFiles(): Generator<FileInfo> {
        const files = IO.getFileInfos(this.rootDir, this.rootDir, true);
        return this.filterFiles(files);
    }

    private isInGitFolder(file: FileInfo): boolean {
        if (file.linuxFullName().includes("/.git/")) {
            this.logger.debug("Omitting %s because it is in the .git folder.", file.fullName);
            return true;
        }

        return false;
    }

    private isInGitignore(file: FileInfo): boolean {
        if (this.gitIgnore!.isIgnored(file.fullName)) {
            this.logger.debug("Omitting %s because it is tracked by .gitignore.", file.fullName);
            return true;
        }

        return false;
    }

    public filterFiles(files: Generator<FileInfo>): Generator<FileInfo> {
        let newFiles = Enumerable.where(files, f => !this.isInGitFolder(f))

        if (this.gitIgnore) {
            newFiles = Enumerable.where(newFiles, f => !this.isInGitignore(f));
        }

        return newFiles;
    }

    public matchFile(file: FileInfo): FileInfoCheck {
        this.logger.debug("Checking: %s", file.fullName);
        
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
    constructor(private readonly logger: Logger) {
    }

    public *matchAllFiles(codeOwners: CodeOwnersLine[], rootDir: string): Generator<FileInfoCheck> {
        const worker = new MatchWorker(rootDir, this.logger, codeOwners);
        const files = worker.getAllFiles();

        for (const file of files) {
            yield worker.matchFile(file);
        }
    }
}