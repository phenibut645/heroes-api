const app = require("express")();
const port = 8080;
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");

app.get("/heroes", (req, res) => {
    res.send(["Shadow Fiend", "Spectre", "Earthshaker", "Tinker", "Broodmother", "Lone Druid", "Wraith King", "Anti Mage", "Phantom Assasin", "Phantom Lancer", "Sand King", "Queen Of Pain", "Ogre Magi", "Axe", "Chaos Knight", "Terrorblade", "Oracle", "Puck", ""])
})

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})