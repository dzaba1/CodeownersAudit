import { CodeOwnersLine } from "./codeOwnersLine";
import { FileInfo } from "./fileSystemInfo";

export interface FileCheck {
    filepath: FileInfo,
    ownersLine?: CodeOwnersLine
}