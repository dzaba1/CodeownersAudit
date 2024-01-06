import { Enumerable } from "./enumerable";
import { FileInfoCheck } from "./fileInfoCheck";
import { DirInfo, FileInfo } from "./fileSystemInfo";
import { MatchWorker } from "./matcher";

enum DirInfoCheckType {
    Empty,
    DifferentOwners
}

interface DirInfoCheck {
    type: DirInfoCheckType,
    check?: FileInfoCheck
}

class DirMatchWorker {
    constructor(private readonly matchWorker: MatchWorker,
        private readonly dir: DirInfo) {

    }

    public getFiles(): Generator<FileInfo> {
        const files = this.dir.getFiles();
        return this.matchWorker.filterFiles(files);
    }

    public getDirs(): Generator<DirMatchWorker> {
        const dirs = this.dir.getDirectories();
        return Enumerable.select(dirs, d => new DirMatchWorker(this.matchWorker, d));
    }

    public *matchFiles(): Generator<FileInfoCheck> {
        const files = this.getFiles();
        for (const file of files) {
            yield this.matchWorker.matchFile(file);
        }
    }

    // public check(): DirInfoCheck {
    //     const subDirs = this.getDirs();
    //     const fileMatches = [...this.matchFiles()];
    //     const isEmpty = !Enumerable.any(subDirs) && fileMatches.length === 0;

    //     if (isEmpty) {
    //         return {
    //             type: DirInfoCheckType.Empty
    //         };
    //     }

    //     let allFilesOwner = true;
    //     if (fileMatches.length !== 0) {
    //         allFilesOwner = Enumerable.all(fileMatches, f => f.ownersLine === fileMatches[0].ownersLine);
    //     }

    //     if (!allFilesOwner) {
    //         return {
    //             type: DirInfoCheckType.DifferentOwners
    //         };
    //     }

    //     let allDirsOwner = true;
    // }
}