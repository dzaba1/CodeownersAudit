import { CodeOwnersLine } from "./codeOwnersLine";
import { FileSystemInfo } from "./fileSystemInfo";

export class FileInfoCheck {
    constructor(public readonly fileOrDir: FileSystemInfo,
        public readonly ownersLine?: CodeOwnersLine) {

    }

    public get unowned(): boolean {
        return this.ownersLine == null || this.ownersLine.owners == null;
    }
}
