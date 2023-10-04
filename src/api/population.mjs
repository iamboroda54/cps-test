import { ApiRoute } from "../model/apiRoute.mjs";
import { ApiRouter } from "../model/apiRouter.mjs";
import { DependencyUtils } from "../utils/dependencyUtils.mjs";
import { PopulationDataSetUtils } from "../utils/populationUtils.mjs";

class StateCityDependency {
    constructor(options) {
        DependencyUtils.init(this, options);
    }
    /** @type {string} */
    state;
    /** @type {string} */
    city;
}

export default class PopulatonApiRouter extends ApiRouter {
    baseUrl = "/population";

    getPopulation = new ApiRoute({
        method: "GET",
        url: "/state/:state/city/:city",
        handler: (req, res, context) => {
            const deps = new StateCityDependency(req.params);

            const population = context.populationDataSet.get(
                PopulationDataSetUtils.getEntityKey(deps.state, deps.city)
            );

            if (population !== undefined) {
                return res.send({ population });
            } else {
                return res
                    .status(400)
                    .send(
                        `Can not find record for ${deps.state} and ${deps.city}`
                    );
            }
        },
    });

    putPopulation = new ApiRoute({
        method: "PUT",
        url: "/state/:state/city/:city",
        handler: (req, res, context) => {
            const population = +req.body;

            if (!Number.isInteger(population)) {
                return res.status(400).send("Incorrect body value");
            }

            const deps = new StateCityDependency(req.params);
            const entityKey = PopulationDataSetUtils.getEntityKey(
                deps.state,
                deps.city
            );
            const isNew = !context.populationDataSet.has(entityKey);

            context.populationDataSet.set(entityKey, population);

            this.#dumpDataSet();

            return res.status(isNew ? 201 : 200).send();
        },
    });

    #dumpDataSet() {
        setTimeout(() => {
            // dump in-memory dataset to underlying storage (RDS, DynamoDB, Cosmos etc)...
        });
    }
}
