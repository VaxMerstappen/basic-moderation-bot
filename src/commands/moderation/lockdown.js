const { ApplicationCommandOptionType, PermissionsBitField, TextChannel, Client } = require('discord.js')

module.exports = {

    name: 'lockdown',
    description: 'Locks down a channel',
    options: [
        {
            name: 'channel',
            description: 'The channel you want to lock',
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],

    callback: async (client, interaction) => {

        if (!interaction.inGuild()) {
            return interaction.reply({ content: 'You can only use this command inside servers!', ephemeral: true})
        };

        if (!interaction.member?.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
           return interaction.reply({ content: 'You do not have permission to use that command.', ephemeral: true })
        };

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'I am missing `ManageRoles` permissions on this server.', ephemeral: true})
        };

        const channel = interaction.options.getChannel('channel')

        if (!channel.type === TextChannel) {
          return interaction.reply({ content: 'This command only works on text channels.', ephemeral: true})
        };

        try {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {SendMessages: false})
            interaction.reply({ content: 'Succesfully locked down channel!', ephemeral: true})
            
        } catch (error) {
            console.log(`${error}`)
            interaction.reply({content: 'An error occured when running this command', ephemeral: true})
        };
    },
};