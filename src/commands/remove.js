const { SlashCommandBuilder } = require('discord.js');
const ticketSchema = require('../schemas/ticket')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Removes a user from a ticket")
        .addUserOption(option => option.setName('user').setDescription("The user you want to remove from this ticket").setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember('user')
        const database = await ticketSchema.findOne({ channelId: interaction.channel.id })
        if (!database) return interaction.reply({ content: `This channel is not a ticket`, ephemeral: true })
        await interaction.channel.permissionOverwrites.edit(member.id, { ViewChannel: false, SendMessages: false, ReadMessageHistory: false }).catch()
        await interaction.reply(`Successfully removed ${member} from this ticket.`)
    }
}
