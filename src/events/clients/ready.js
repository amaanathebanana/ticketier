const { loadCommands } = require("../../handlers/commandHandler");
const config = require("../../../config.json");
const mongoose = require("mongoose");
module.exports = {
    id: "ready",
    once: true,
    async execute(client) {
        await loadCommands(client)
        await mongoose.connect(config.databaseURL).then(() => console.log("Connected to Ticket Database"));
        console.log(`Logged into ${client.user.username}#${client.user.discriminator} | ${client.user.id}`)
    }
}