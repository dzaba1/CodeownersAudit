import { IO } from "./io";
import path from "path";
import { IgnoreWrap } from "./ignoreWrap";
import { FileInfo } from "./fileSystemInfo";
import { Logger } from "winston";

export class GitIgnore {
    private ignore?: IgnoreWrap;
    private rootDir: string;

    constructor(private readonly gitIgnoreFile: string,
        private readonly logger: Logger) {
        this.rootDir = path.dirname(this.gitIgnoreFile);
    }

    private initIgnore() {
        if (this.ignore) {
            return;
        }

        this.ignore = new IgnoreWrap();
        this.logger.info("Start parsing %s file.", this.gitIgnoreFile);
        const lines = IO.readLines(this.gitIgnoreFile);

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

            this.ignore.add(trimmed);
        }
    }

    public isIgnored(file: string): boolean {
        this.initIgnore();

        const fileInfo = new FileInfo(file, this.rootDir);
        return this.ignore!.ignores(fileInfo);
    }
}