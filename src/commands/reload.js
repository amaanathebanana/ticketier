const { ChatInputCommandInteraction, SlashCommandBuilder, Client } = require("discord.js");
const { loadCommands } = require("../handlers/commandHandler");
const { loadInteractions } = require("../handlers/interactionHandler");
module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reloads the bot"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        await interaction.reply({
            content: "Reloading...",
            ephemeral: true
        })
        for (const [key, value] of client.events)
            client.removeListener(`${key}`, value, true);
        console.log(`${interaction.user.username}#${interaction.user.discriminator} | ${interaction.user.id} triggered a reload`)
        loadInteractions(client);
        loadCommands(client)
        interaction.editReply({
            content: "Reloaded events, commands, buttons, select menus and modals. Reloading Completed",
        })

    }
}

