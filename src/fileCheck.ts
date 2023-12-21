import { CodeOwnersLine } from "./codeOwnersLine";
import { FileInfo } from "./fileInfo";

export interface FileCheck {
    filepath: FileInfo,
    ownersLine?: CodeOwnersLine
}