import path from "path";

export class FileInfo {
    constructor(public readonly fullName: string,
        public readonly rootDir: string) {

    }

    public get relative(): string {
        let relative = this.fullName.replace(this.rootDir, "");
        if (relative[0] === path.sep) {
            relative = relative.substring(1);
        }

        return relative;
    }

    public get linuxFullName(): string {
        return this.fullName.replaceAll("\\", "/");
    }
    
    public get relativeLinux(): string {
        const relative = this.relative;
        return relative.replaceAll("\\", "/");
    }
}