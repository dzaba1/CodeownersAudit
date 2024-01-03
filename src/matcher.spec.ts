import os from "os";
import path from "path";
import fs from "fs";
import { IO } from "./io";
import { Matcher } from "./matcher";
import { CodeOwnersLine } from "./codeOwnersLine";

describe("Matcher", () => {
    let tempPath: string;

    function cleanUp() {
        if (tempPath && IO.directoryExists(tempPath)) {
            IO.removeDirectory(tempPath);
        }
    }

    beforeEach(() => {
        const temp = os.tmpdir();
        tempPath = path.join(temp, "Matcher");

        cleanUp();
        fs.mkdirSync(tempPath);
    });

    afterEach(() => {
        cleanUp();
    });

    function createSut(): Matcher {
        return new Matcher();
    }

    function writeSomeFile(filename: string, content: string): string {
        const filepath = path.join(tempPath, filename);
        fs.writeFileSync(filepath, content);
        return filepath;
    }

    function makeSomeDir(dirname: string): string {
        const dirPath = path.join(tempPath, dirname);
        fs.mkdirSync(dirPath);
        return dirPath;
    }

    it("matchAllFiles - when only codeowners then one match", () => {
        const codeOwnersFile = writeSomeFile("CODEOWNERS", "* user1");

        const codeOwners = [new CodeOwnersLine("*", ["user1"])];
        const sut = createSut();
        const result = [...sut.matchAllFiles(codeOwners, tempPath)];
        expect(result.length).toBe(1);
        expect(result[0].fileOrDir.fullName).toBe(codeOwnersFile);
    });

    it("matchAllFiles - when git directory then git files are not matched", () => {
        makeSomeDir(".git");
        writeSomeFile(path.join(".git", "test.txt"), "Test");

        const codeOwners = [new CodeOwnersLine("*", ["user1"])];
        const sut = createSut();
        const result = [...sut.matchAllFiles(codeOwners, tempPath)];
        expect(result.length).toBe(0);
    });

    it("matchAllFiles - when only codeowners and .gitignore then no match", () => {
        writeSomeFile("CODEOWNERS", "* user1");
        writeSomeFile(".gitignore", `CODEOWNERS
        .gitignore`);

        const codeOwners = [new CodeOwnersLine("*", ["user1"])];
        const sut = createSut();
        const result = [...sut.matchAllFiles(codeOwners, tempPath)];
        expect(result.length).toBe(0);
    });
});