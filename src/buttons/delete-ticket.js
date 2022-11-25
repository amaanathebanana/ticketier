const { EmbedBuilder } = require('discord.js')
const discordTranscripts = require('discord-html-transcripts')
const ticketSchema = require('../schemas/ticket')
const config = require('../../config.json')
module.exports = {
    id: "delete-ticket",
    async execute(interaction) {
        const database = await ticketSchema.findOne({ channelId: interaction.channel.id })
        if (!database) return interaction.reply({ content: `This channel is not a ticket`, ephemeral: true })
        if (database.closed == false) return interaction.reply({ content: `This channel is not closed`, ephemeral: true })
        await interaction.reply('Creating Transcript. This ticket will be deleted soon.')
        const attachment = await discordTranscripts.createTranscript(interaction.channel)
        const embed = new EmbedBuilder()
            .setTitle('Ticket Transcript')
            .setColor('Blurple')
            .addFields({
                name: `Ticket Creator`,
                value: `<@${database.userId}> | ${database.userId}`,
                inline: true
            }, {
                name: `Channel ID`,
                value: `${database.channelId}`,
                inline: true
            })
        const channel = await interaction.guild.channels.cache.get(config.logId)
        await channel.send({ embeds: [embed], files: [attachment]})
        await interaction.editReply(`Transcript Made. Ticket deleting`)
        await interaction.channel.delete()
        await database.delete() 
    }
}
