const ticketSchema = require('../../schemas/ticket')
module.exports = {
    id: "channelDelete",
    async execute(channel) {
        await ticketSchema.findOneAndDelete({ channelId: channel.id })
    }
}

