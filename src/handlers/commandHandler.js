async function loadCommands(client) {
    const { fileLoader } = require("../functions/fileLoader");

    await client.commands.clear();
    let commandArray = [];
    let commandCount = 0;
    const commandFiles = await fileLoader("commands");
    commandFiles.forEach((file) => {
        const command = require(file);
        client.commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        commandCount++
    });

    client.application.commands.set(commandArray);
    return console.log(`Loaded ${commandCount} commands`)
}

module.exports = { loadCommands }