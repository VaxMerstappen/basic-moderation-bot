const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'unmute',
    description: 'Unmute a user.',
    options: [
        {
            name: 'user',
            description: 'The user you want to unmute',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason to unmute.',
            type: ApplicationCommandOptionType.String
        }
    ],

    callback: async(client, interaction) => {

        if (!interaction.inGuild()) {
            return interaction.reply({ content: 'You can only use this command inside servers!', ephemeral: true})
        };

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const unmuteEmbed = new EmbedBuilder()
        .setColor('00ff00')
        .setTitle('User Unmuted')
        .setDescription(`${user} was succesfully unmuted.`)
        .addFields(
            { name: 'Reason', value: reason}
        )
        .setTimestamp();

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'You do not have permission to use that command', ephemeral: true })
        };

        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'I am missing `ModerateMembers` permissions on this server.', ephemeral: true})
        };

        if(!member.isCommunicationDisabled) {
            return interaction.reply({ content: 'That user is not muted.', ephemeral: true})
        };

        try {
           await member.timeout(null, reason)
           await interaction.reply({ embeds: [unmuteEmbed] })
        } catch (error) {
           console.log(`There was an error ${error}`)
           return interaction.reply({ content: 'There was an error when unmuting that user', ephemeral: true })
        }

     
    },
};