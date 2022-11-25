const { SlashCommandBuilder } = require('discord.js');
const ticketSchema = require('../schemas/ticket')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("open")
        .setDescription("Re-open a closed ticket"),
    async execute(interaction) {
        const database = await ticketSchema.findOne({ channelId: interaction.channel.id })
        if (!database) return interaction.reply({ content: `This channel is not a ticket`, ephemeral: true })
        if (database.closed == false) return interaction.reply({ content: `This channel is not closed`, ephemeral: true })
        await interaction.channel.permissionOverwrites.edit(database.userId, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true })
        let name = interaction.channel.name.split('closed-')[1]
        if (!name) name = `ticket-${database.userId}`
        await interaction.channel.edit({ name: `${name}` })
        database.closed = false
        await database.save()
        await interaction.reply(`This ticket has been reopened`)
    }
}
