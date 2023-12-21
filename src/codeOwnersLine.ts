export class CodeOwnersLine {
    constructor(public readonly pattern: string,
        public readonly owners?: string[]) {

    }

    public displayOwners(): string | undefined {
        if (this.owners) {
            return this.owners.join(" ");
        }

        return undefined;
    }
}