const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'role-add',
    description: 'Add a role to a selected user.',
    options: [
        {
            name: 'user',
            description: 'The user to add the role to.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'role',
            description: 'The role you want to add.',
            type: ApplicationCommandOptionType.Role,
            required: true
        },
    ],

    callback: async (client, interaction) => {

        if (!interaction.inGuild()) {
            return interaction.reply({ content: 'You can only use this command inside servers!', ephemeral: true})
        };

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'You do not have permission to use that command.', ephemeral: true })
        };

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'I am missing `ManageRoles` permissions on this server.', ephemeral: true })
        };

        const newRole = interaction.options.getRole('role');
        const member = interaction.options.getMember('user');
        const user = interaction.options.getUser('user');

        const roleEmbed = new EmbedBuilder()
        .setColor('00ff00')
        .setTitle('Role added')
        .setDescription(`Succesfully added ${newRole} to ${user.tag}.`)

        try {
            await member.roles.add(newRole)
            return interaction.reply({ embeds: [roleEmbed] })
        } catch (error) {
            return interaction.reply({ content: 'There was an error while adding that role.', ephemeral: true })
        }
    },
};