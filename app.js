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
            +population
        );
    }

    return dataSet;
}

async function initApi() {
    const apiControllerPathList = await glob("src/api/**/*.mjs");

    for (const apiControllerPath of apiControllerPathList) {
        const apiController = new (
            await import(`./${apiControllerPath}`)
        ).default();

        for (const apiRoute of Object.values(apiController).filter(
            (v) => v instanceof ApiRoute
        )) {
            app[apiRoute.method.toLocaleLowerCase()](
                `/api${apiController.baseUrl}${apiRoute.url}`,
                (req, res) => apiRoute.handler(req, res, appContext)
            );
        }
    }
}

async function runApp() {
    app.use(express.text());

    await initApi();

    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
}

runApp();
