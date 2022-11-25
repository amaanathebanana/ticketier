const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("send-panel")
        .setDescription("Send the ticket panel")
        .addChannelOption(option => option.setName('channel').setDescription('Channel to send the panel message to').setRequired(true))
    ,
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const channel = interaction.options.getChannel('channel')
        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle('Tickets')
            .setDescription('Open a ticket using the button below!')
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create-ticket')
                    .setLabel('Create Ticket')
                    .setStyle(ButtonStyle.Success),
            )
        try {
            await channel.send({ embeds: [embed], components: [row] })
        } catch (error) {
            console.log(error)
            return interaction.reply({ content: 'Failed to send embed. Check console for more info', ephemeral: true })
        }
        await interaction.reply({ content: `Successfully sent panel message to ${channel}`, ephemeral: true })
    }
}

