import path from "path";
import { IO } from "./io";
import { Enumerable } from "./enumerable";

export class FileSystemInfo {
    constructor(public readonly fullName: string,
        public readonly rootDir: string,
        public readonly isDirectory: boolean) {

    }

    public relative(): string {
        let relative = this.fullName.replace(this.rootDir, "");
        if (relative[0] === path.sep) {
            relative = relative.substring(1);
        }

        return relative;
    }

    public linuxFullName(): string {
        return this.fullName.replaceAll("\\", "/");
    }
    
    public relativeLinux(): string {
        const relative = this.relative();
        return relative.replaceAll("\\", "/");
    }

    public parentDir(): DirInfo {
        const parent = path.dirname(this.fullName);
        return new DirInfo(parent, this.rootDir);
    }
}

export class FileInfo extends FileSystemInfo {
    constructor(fullName: string,
        rootDir: string) {
        super(fullName, rootDir, false);
    }
}

export class DirInfo extends FileSystemInfo {
    constructor(fullName: string,
        rootDir: string) {
        super(fullName, rootDir, true);
    }

    public getFiles(): Generator<FileInfo> {
        return IO.getFileInfos(this.fullName, this.rootDir, false);
    }

    public getDirectories(): Generator<DirInfo> {
        return IO.getDirInfos(this.fullName, this.rootDir, false);
    }

    public empty(): boolean {
        return !Enumerable.any(this.getFiles()) && !Enumerable.any(this.getDirectories());
    }
}