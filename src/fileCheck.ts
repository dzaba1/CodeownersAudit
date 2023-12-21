import { CodeOwnersLine } from "./codeOwnersLine";
import { DirInfo, FileInfo } from "./fileSystemInfo";

export interface FileCheck {
    file: FileInfo,
    ownersLine?: CodeOwnersLine
}
