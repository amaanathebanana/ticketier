const ticketSchema = require('../schemas/ticket')
const config = require('../../config.json')
module.exports = {
    id: 'unclaim-ticket',
    async execute(interaction) {
        const database = await ticketSchema.findOne({ channelId: interaction.channel.id })
        if (!database) return interaction.reply({ content: `This channel is not a ticket`, ephemeral: true })
        if (!database.claimed) return interaction.reply({ content: `This ticket is not claimed`, ephemeral: true })
        if (database.userId == interaction.user.id) return interaction.reply({ content: `Unclaiming is only for the support team!.`, ephemeral: true })
        if (database.closed) return interaction.reply({ content: `You cannot unclaim a closed ticket.`, ephemeral: true })
        await interaction.reply({ content: `This ticket has been unclaimed by ${interaction.user}` })
        await interaction.channel.permissionOverwrites.edit(config.staffId, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true })
        database.claimed == false
        await database.save()
    }
}
