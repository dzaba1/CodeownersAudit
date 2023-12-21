import * as fs from 'fs';
import * as path from 'path';
import { DirInfo, FileInfo } from './fileSystemInfo';
import { Enumerable } from './enumerable';

export module IO {
    export function readLines(filename: string): string[] {
        return fs
            .readFileSync(filename)
            .toString()
            .split(/\r\n|\r|\n/);
    }

    export function *getFiles(dir: string, recurse: boolean): Generator<string> {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            const subFile = path.join(dir, file.name);

            if (file.isDirectory() && recurse) {
                yield* getFiles(subFile, true);
            } else {
                yield subFile;
            }
        }
    }

    export function *getDirectories(dir: string, recurse: boolean): Generator<string> {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory()) {
                const subDir = path.join(dir, file.name)
                yield subDir;

                if (recurse) {
                    yield* getDirectories(subDir, true);
                }
            }
        }
    }

    export function getFileInfos(dir: string, rootDir: string, recurse: boolean) : Generator<FileInfo> {
        const files = getFiles(dir, recurse);
        return Enumerable.select(files, f => new FileInfo(f, rootDir));
    }

    export function getDirInfos(dir: string, rootDir: string, recurse: boolean) : Generator<DirInfo> {
        const dirs = getDirectories(dir, recurse);
        return Enumerable.select(dirs, d => new DirInfo(d, rootDir));
    }

    export function fileExists(file: string): boolean {
        return fs.existsSync(file);
    }
}