const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ticketSchema = require('../schemas/ticket')

module.exports = {
    id: "close-ticket",
    async execute(interaction) {
        const database = await ticketSchema.findOne({ channelId: interaction.channel.id })
        if (!database) return interaction.reply({ content: `This channel is not a ticket`, ephemeral: true })
        if (database.closed == true) return interaction.reply({ content: `This channel is already closed.`, ephemeral: true })
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('open-ticket')
                    .setLabel('Re-Open Ticket')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🔓'),
                new ButtonBuilder()
                    .setCustomId('delete-ticket')
                    .setLabel('Delete Ticket')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('❌'),
                new ButtonBuilder()
                    .setCustomId('transcript-ticket')
                    .setLabel('Transcript Ticket')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📜')
            )
        await interaction.reply({ content: `Closing this ticket.`, components: [row] })
        await interaction.channel.permissionOverwrites.delete(database.userId);
        await interaction.channel.edit({ name: `closed-${interaction.channel.name}` })
        database.closed = true
        await database.save()
    }
}
