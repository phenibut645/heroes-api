const app = require("express")();
const port = 8080;
const express = require("express");
app.use(express.json());
const swaggerUi = require("swagger-ui-express");
const yamljs = require("yamljs");
const swaggerDocument = yamljs.load('./docs/swagger.yaml');

const attributes = {
    "STRENGTH": "Strength",
    "AGILITY": "Agility",
    "INTELLIGENCE": "Intelligence",
    "UNIVERSAL": "Universal"
}

const heroes = [
    {id: 1, name: "Shadow Fiend", attribute: attributes.AGILITY},
    {id: 2, name: "Terrorblade", attribute: attributes.AGILITY},
    {id: 3, name: "Spectre", attribute: attributes.UNIVERSAL},
    {id: 4, name: "Skywrath Mage", attribute: attributes.INTELLIGENCE},
    {id: 5, name: "Wraith King", attribute: attributes.STRENGTH},
    {id: 6, name: "Axe", attribute: attributes.STRENGTH},
    {id: 7, name: "Earthshaker", attribute: attributes.STRENGTH},
    {id: 8, name: "Marci", attribute: attributes.UNIVERSAL},
    {id: 9, name: "Medusa", attribute: attributes.AGILITY},
    {id: 10, name: "Queen Of Pain", attribute: attributes.INTELLIGENCE},
    {id: 11, name: "Puck", attribute: attributes.INTELLIGENCE},
    {id: 12, name: "Arc Warden", attribute: attributes.UNIVERSAL}
]

app.get("/heroes", (req, res) => {
    res.send(heroes)
})

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get("/heroes/:id", (req, res) => {
    const hero = heroes.find(el => {
        if(el.id == req.params.id) return true
        return false
    });
    if(!hero){
        return res.status(404).send({error: "Hero not found"})
    }
    else {
        res.send(hero);
    }
   
})

app.delete("/heroes/:id", (req, res) => {
    if(!req.body.id) {
        return res.status(400).send({
            "error": "Id is required"
        })
    }
    if(typeof heroes[req.params.id - 1] === "undefined"){
        return res.status(404).send({"error": "Hero not found"});
    }
    if(heroes[req.params.id - 1].name === "Shadow Fiend"){
        return res.status(409).send({
            "error": "You cannot delete this"
        })
    }

    heroes.splice(req.params.id - 1, 1);
    res.status(204).send({error: "No content"});
})

app.post("/heroes", (req, res) => {
    if(!req.body.attribute || !req.body.name){
        return res.status(400).send({"error": "One or all params are missing"})
    }
    if(heroes.find(hero => {
        hero.name === req.body.name
    })){
        return res.status(409).send({
            "error": "The same name already exists"
        })
    }
    if(req.headers["content-type"] !== "application/json"){
        return res.status(415).send({
            "error": "Invalid content-type"
        })
    }
    const hero = {
        id: heroes.length + 1,
        price: req.body.attribute,
        name: req.body.name
    }
    if(Object.values(attributes).find(attribute => attribute === req.body.attribute)) {
        heroes.push(hero)
        res.status(201).location(`${getBaseUrl(req)}/heroes/${heroes.length}`).send(hero);
    }
    else {
        res.status(400).send({
            "error": "Given attribute isn't valid"
        })
    }

})

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})

function getBaseUrl(req){
    return req.connection && req.connection.encrypted ? "https" : "http" + `://${req.headers.host}`
}