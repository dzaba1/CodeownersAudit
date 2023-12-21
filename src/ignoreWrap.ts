import ignore from "ignore";
import { FileInfo } from "./fileSystemInfo";

export class IgnoreWrap {
    private readonly ignoreMgr = ignore();

    public add(line: string) {
        this.ignoreMgr.add(line);
    }

    public ignores(file: FileInfo): boolean {
        return this.ignoreMgr!.ignores(file.relativeLinux());
    }
}