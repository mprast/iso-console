// declare jest-imported globals so we
// don't get errors from typescript
declare let test: any;
declare let expect: any;

export class ErrorsAsserter {
    private errors: Array<string> = [];

    public push(error: string) {
        this.errors.push(error);
    }

    public assertNoErrors() {
        if (this.errors.length === 0) {
            expect.anything(1);
        } else {
            const errorsString = this.errors.join(`\n`);
            const message = `Test failed! Error(s) were:\n\n${errorsString}`;
            expect(message).toBe("");
        }
    }
}
