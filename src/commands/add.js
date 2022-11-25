const { SlashCommandBuilder } = require('discord.js');
const ticketSchema = require('../schemas/ticket')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add a user to a ticket")
        .addUserOption(option => option.setName('user').setDescription("The user you want to add to this ticket").setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember('user')
        const database = await ticketSchema.findOne({ channelId: interaction.channel.id })
        if (!database) return interaction.reply({ content: `This channel is not a ticket`, ephemeral: true })
        await interaction.channel.permissionOverwrites.edit(member.id, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true }).catch()
        await interaction.reply(`Successfully added ${member} to this ticket.`)
    }
}
