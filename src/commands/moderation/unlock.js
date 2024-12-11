const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js')

module.exports = {

    name: 'unlock',
    description: 'Unlock a channel',
    options: [
        {
            name: 'channel',
            description: 'The channel you want to unclock',
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],

    callback: async (interaction, client) => {

        if (!interaction.inGuild()) {
            return interaction.reply({ content: 'You can only use this command inside servers!', ephemeral: true})
        };

        if(!interaction.member?.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            interaction.reply ({content: 'You do not have permission to use that command.', ephemeral: true})
            return;
        };

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            interaction.reply ({ content: 'I am missing `ManageChannel` permissions on this server.', ephemeral: true})
            return;
        };

        const channel = interaction.options.getChannel('channel')

        if (!channel.type === TextChannel) {
            interaction.reply({ content: 'This command only works on text channels.', ephemeral: true})
            return;
        };


        try {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {SendMessages: true})
            interaction.reply({ content: 'Succesfully unlocked down channel!', ephemeral: true})
        } catch (error) {
            console.log(`${error}`)
            interaction.reply({content: 'An error occured when running this command', ephemeral: true})
        }
    },
};