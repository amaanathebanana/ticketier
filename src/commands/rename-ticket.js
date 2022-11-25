const { SlashCommandBuilder } = require('discord.js');
const ticketSchema = require('../schemas/ticket')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rename")
        .setDescription("Rename this ticket")
        .addStringOption(option => option.setName('name').setDescription("What are you renaming this ticket to?").setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name')
        const database = await ticketSchema.findOne({ channelId: interaction.channel.id })
        if (!database) return interaction.reply({ content: `This channel is not a ticket`, ephemeral: true })
        await interaction.channel.edit({ name: name })
        await interaction.reply(`Successfully renamed this ticket to ${name}.`)
    }
}
