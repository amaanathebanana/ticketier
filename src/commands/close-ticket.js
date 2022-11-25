const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ticketSchema = require('../schemas/ticket')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("close-ticket")
        .setDescription("Closes a ticket"),
    async execute(interaction) {
        const database = await ticketSchema.findOne({ channelId: interaction.channel.id })
        if (!database) return interaction.reply({ content: `This channel is not a ticket`, ephemeral: true })
        if (database.closed == true) return interaction.reply({ content: `This channel is already closed.`, ephemeral: true })
        try {
            await interaction.channel.permissionOverwrites.delete(database.userId);
            await interaction.channel.edit({ name: `closed-${interaction.channel.name}` })
            database.closed = true
            await database.save()
        } catch (error) {
            console.log(error)
        }
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
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('❌')
            )
        await interaction.reply({ content: `Closing this ticket.`, components: [row] })
    }
}
