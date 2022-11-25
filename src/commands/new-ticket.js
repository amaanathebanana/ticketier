const config = require('../../config.json')
const { SlashCommandBuilder, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const ticketSchema = require('../schemas/ticket')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("new-ticket")
        .setDescription("Creates a ticket"),
    async execute(interaction) {
        await interaction.reply({ content: `Creating a ticket for you! Please wait.`, ephemeral: true })
        let channel
        try {
            channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.member.user.username}`,
                type: ChannelType.GuildText,
                parent: config.parentId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                    },
                    {
                        id: interaction.member.id,
                        allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                    },
                    {
                        id: config.staffId,
                        allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                    },
                ]
            })
        } catch (error) {
            console.log(error)
            return interaction.editReply('There was an error while creating your ticket. Please report this to a staff member.')
        }
        const addDB = new ticketSchema({
            guildId: interaction.guild.id,
            userId: interaction.member.id,
            channelId: channel.id,
            closed: false,
            claimed: false,
            username: interaction.member.user.username,
        })
        await addDB.save()
        const embed = new EmbedBuilder()
            .setTitle(`Ticket`)
            .setDescription(`${interaction.member} needs support!`)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close-ticket')
                    .setLabel('Close Ticket')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🔒')
            )
        await channel.send({ content: `<@&${config.staffId}>`, embeds: [embed], components: [row] })
        await interaction.editReply(`A ticket has been created for you at ${channel}`)
    }
}
