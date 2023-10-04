export class AppContext {
    /** @param {AppContext} initValue */
    constructor(initValue) {
        Object.assign(this, initValue);
    }

    /** @type {Map<string, number>} */
    populationDataSet;
}
