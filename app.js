import express from "express";
import fs from "fs";
import { glob } from "glob";
import { ApiRoute } from "./src/model/apiRoute.mjs";
import { AppContext } from "./src/model/appContext.mjs";
import { PopulationDataSetUtils } from "./src/utils/populationUtils.mjs";

const app = express();
const port = 5555;
const appContext = new AppContext({
    populationDataSet: initPopulationDataSet(),
});

function initPopulationDataSet() {
    const dataSet = new Map();
    const rawData = fs.readFileSync("data/city_populations.csv");

    for (const row of rawData.toString().split(/\r?\n/)) {
        const [city, state, population] = row.split(",");
        dataSet.set(
            PopulationDataSetUtils.getEntityKey(state, city),
            population
        );
    }

    return dataSet;
}

async function initApi() {
    const apiRoutersPathList = await glob("src/api/**/*.mjs");

    for (const apiRouterPath of apiRoutersPathList) {
        const apiRouter = new (await import(`./${apiRouterPath}`)).default();

        for (const apiRoute of Object.values(apiRouter).filter(
            (v) => v instanceof ApiRoute
        )) {
            app[apiRoute.method.toLocaleLowerCase()](
                `/api${apiRouter.baseUrl}${apiRoute.url}`,
                (req, res) => apiRoute.handler(req, res, appContext)
            );
        }
    }
}

async function runApp() {
    await initApi();

    app.use(express.text({ type: "text/plain" }));
    app.use(express.json());

    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
}

runApp();
