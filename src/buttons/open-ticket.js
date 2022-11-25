const ticketSchema = require('../schemas/ticket')

module.exports = {
    id: 'open-ticket',
    async execute(interaction) {
        const database = await ticketSchema.findOne({ channelId: interaction.channel.id })
        if (!database) return interaction.reply({ content: `This channel is not a ticket`, ephemeral: true })
        if (database.closed == false) return interaction.reply({ content: `This channel is not closed`, ephemeral: true })
        await interaction.reply(`This ticket has been reopened`)
        await interaction.channel.permissionOverwrites.edit(database.userId, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true })
        let name = interaction.channel.name.split('closed-')[1]
        if (!name) name = `ticket-${database.username}`
        await interaction.channel.edit({ name: `${name}` })
        database.closed = false
        await database.save()

    }
}
