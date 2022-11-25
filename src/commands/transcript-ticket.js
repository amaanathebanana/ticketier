const { SlashCommandBuilder } = require('discord.js')
const ticketSchema = require('../schemas/ticket')
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("transcript")
        .setDescription("Transcript a ticket"),
    async execute(interaction) {
        const database = await ticketSchema.findOne({ channelId: interaction.channel.id })
        if (!database) return interaction.reply({ content: `This channel is not a ticket`, ephemeral: true })
        await interaction.reply({ content: `Creating transcript please wait.`, ephemeral: true })
        const attachment = await discordTranscripts.createTranscript(interaction.channel)
        await interaction.followUp({ files: [attachment], })
    }
}