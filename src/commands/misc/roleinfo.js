const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'role-info',
    description: 'Get information about a role',
    options: [
        {
            name: 'role',
            description: 'The ID of the role you want to get info on.',
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
    ],

    callback: async (client, interaction) => {

        if (!interaction.inGuild()) {
            return interaction.reply({ content: 'You can only use this command inside servers!', ephemeral: true})
        };

        const role = interaction.options.getRole('role');
        const color = role.hexColor;
        const id = role.id;
        const mentionable = role.mentionable ? 'Yes' : 'No';
        const createdAt = role.createdAt.toDateString();
        const permissions = role.permissions.toArray().join(', ') || 'No additional permissions.';
        const members = role.members.size || '0';

        const roleEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`Information for role '${role.name}'.`)
        .addFields(
            { name: 'ID', value: id, inline: true },
            { name: 'Hex color', value: color, inline: true },
            { name: 'Created At', value: `${createdAt}`, inline: true },
            { name: 'Mentionable', value: mentionable, inline: true },
            { name: 'Members', value: `${members}`, inline: true },
            { name: 'Permissions', value: permissions}
        )
        
        interaction.reply({ embeds: [roleEmbed] })
    }
};