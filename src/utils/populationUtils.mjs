export class PopulationDataSetUtils {
    /**
     * @param {string} state
     * @param {string} city
     */
    static getEntityKey(state, city) {
        return `${state.toLowerCase()}#${city.toLowerCase()}`;
    }
}
