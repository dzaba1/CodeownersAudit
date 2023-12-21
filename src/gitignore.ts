import { IO } from "./io";
import path from "path";
import { IgnoreWrap } from "./ignoreWrap";
import { FileInfo } from "./fileSystemInfo";

export class GitIgnore {
    private ignore?: IgnoreWrap;
    private rootDir: string;

    constructor(private gitIgnoreFile: string) {
        this.rootDir = path.dirname(this.gitIgnoreFile);
    }

    private initIgnore() {
        if (this.ignore) {
            return;
        }

        this.ignore = new IgnoreWrap();
        const lines = IO.readLines(this.gitIgnoreFile);

        for (const line of lines) {
            if (!line) {
                continue;
            }

            if (line.startsWith('#')) {
                continue;
            }

            this.ignore.add(line);
        }
    }

    public isIgnored(file: string): boolean {
        this.initIgnore();

        const fileInfo = new FileInfo(file, this.rootDir);
        return this.ignore!.ignores(fileInfo);
    }
}