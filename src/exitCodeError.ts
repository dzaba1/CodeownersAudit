export enum ExitCode {
    Ok = 0,
    Unknown = 1,
    CodeOwnersMissing
}

export class ExitCodeError extends Error {
    constructor(msg: string,
        public readonly exitCode: ExitCode) {

        super(msg);
    }
}