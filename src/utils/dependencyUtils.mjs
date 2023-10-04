export class DependencyUtils {
    /**
     * @param {Object<string, any>} target
     * @param {Object<string, any>} container
     */
    static init(target, container) {
        for (const depKey of Object.getOwnPropertyNames(target)) {
            const dependency = container[depKey];
            if (dependency === null || dependency === undefined) {
                throw new Error(`Missing dependency '${depKey}'`);
            }
            target[depKey] = dependency;
        }
    }
}
