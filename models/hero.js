const mongoose = require('mongoose');
 
const heroSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    attribute: {
        type: String,
        required: true,
        enum: ['Strength', 'Agility', 'Intelligence', 'Universal']
    }
});
 
module.exports = mongoose.model('Hero', heroSchema);
