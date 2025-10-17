const app = require("express")();
const port = 8080;
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");

const heroes = [
    "Shadow Fiend", "Spectre", "Earthshaker", "Tinker", "Broodmother", "Lone Druid", "Wraith King", "Anti Mage",
    "Phantom Assasin", "Phantom Lancer", "Sand King", "Queen Of Pain", "Ogre Magi", "Axe", "Chaos Knight",
    "Terrorblade", "Oracle", "Puck", "Kez", "Ringmaster", "Primal Beast", "Lion", "Lich", "Shadow Shaman",
    "Shadow Demon", "Hoodwink", "Techies", "Pangolier", "Windranger", "Drow Ranger", "Razor", "Sven",
    "Necrophos", "Troll Warlord", "Juggernaut", "Meepo", "Wiver", "Venomancer", "Viper", "Timbersaw", "Marci", "Huskar"
]

app.get("/heroes", (req, res) => {
    res.send()
})

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get("/heroes/:id", (req, res) => {
    res.send(games[req.params.id]);
})

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})