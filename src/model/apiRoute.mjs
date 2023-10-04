// eslint-disable-next-line no-unused-vars

export class ApiRoute {
    /** @param {ApiRoute} initValue */
    constructor(initValue) {
        Object.assign(this, initValue);
    }

    /** @type {'GET' | 'PUT'} */
    method;

    /** @type {string} */
    url;

    /**
     * @type {(req: import("express").Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>, res: import("express").Response<any, Record<string, any>, number>, context: import("./appContext.mjs").AppContext) => Promise<any>}
     */
    handler;
}
