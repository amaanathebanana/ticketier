const ticketSchema = require('../schemas/ticket')
const config = require('../../config.json')
const { ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js')
module.exports = {
    id: 'claim-ticket',
    async execute(interaction) {
        const database = await ticketSchema.findOne({ channelId: interaction.channel.id })
        if (!database) return interaction.reply({ content: `This channel is not a ticket`, ephemeral: true })
        if (database.claimed) return interaction.reply({ content: `This ticket is already claimed by someone else!`, ephemeral: true })
        if (database.userId == interaction.user.id) return interaction.reply({ content: `Claiming is only for the support team!.`, ephemeral: true })
        if (database.closed) return interaction.reply({ content: `You cannot claim a closed ticket.`, ephemeral: true })
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('unclaim-ticket')
                    .setLabel('Unclaim Ticket')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📌'))

        await interaction.reply({ content: `This ticket has been claimed by ${interaction.user}`, components: [row] })
        await interaction.channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true })
        await interaction.channel.permissionOverwrites.delete(config.staffId)
        database.claimed = true
        database.claimedId = interaction.user.id
        await database.save()
    }
}
