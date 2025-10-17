require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const yamljs = require("yamljs");
const Hero = require('./models/hero');
const app = express();
const port = 8080;

app.use(express.json());

const swaggerDocument = yamljs.load('./docs/swagger.yaml');
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const attributes = ["Strength", "Agility", "Intelligence", "Universal"];

const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));


app.get("/heroes", async (req, res) => {
    try {
        const heroes = await Hero.find();
        res.json(heroes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/heroes/:id", async (req, res) => {
    try {
        const hero = await Hero.findOne({ id: parseInt(req.params.id) });
        if (!hero) return res.status(404).json({ message: "Hero not found" });
        res.json(hero);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/heroes", async (req, res) => {
    try {
        const lastHero = await Hero.findOne().sort({ id: -1 });
        const newId = lastHero ? lastHero.id + 1 : 1;

        if (!req.body.name || !req.body.attribute) {
            return res.status(400).json({ message: "Name and attribute are required" });
        }

        if (!attributes.includes(req.body.attribute)) {
            return res.status(400).json({ message: "Invalid attribute" });
        }

        const existingHero = await Hero.findOne({ name: req.body.name });
        if (existingHero) return res.status(409).json({ message: "Hero already exists" });

        const hero = new Hero({
            id: newId,
            name: req.body.name,
            attribute: req.body.attribute
        });

        const newHero = await hero.save();
        res.status(201).json(newHero);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put("/heroes/:id", async (req, res) => {
    try {
        const hero = await Hero.findOne({ id: parseInt(req.params.id) });
        if (!hero) return res.status(404).json({ message: "Hero not found" });

        if (req.body.name) hero.name = req.body.name;
        if (req.body.attribute) {
            if (!attributes.includes(req.body.attribute)) {
                return res.status(400).json({ message: "Invalid attribute" });
            }
            hero.attribute = req.body.attribute;
        }

        const updatedHero = await hero.save();
        res.json(updatedHero);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete("/heroes/:id", async (req, res) => {
    try {
        const hero = await Hero.findOne({ id: parseInt(req.params.id) });
        if (!hero) return res.status(404).json({ message: "Hero not found" });
        if (hero.name === "Shadow Fiend") return res.status(409).json({ message: "You cannot delete this hero" });

        await hero.remove();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`);
});
