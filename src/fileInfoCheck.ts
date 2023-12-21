import { CodeOwnersLine } from "./codeOwnersLine";
import { FileSystemInfo } from "./fileSystemInfo";

export interface FileInfoCheck {
    fileOrDir: FileSystemInfo,
    ownersLine?: CodeOwnersLine
}
