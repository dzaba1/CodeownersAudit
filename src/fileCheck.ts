import { FileInfo } from "./fileInfo";

export interface FileCheck {
    filepath: FileInfo,
    owners?: string,
    pattern?: string
}