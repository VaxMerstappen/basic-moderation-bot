const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField, time } = require('discord.js')

module.exports = {
    name: 'mute',
    description: 'Mute a member',
    options: [
        {
            name: 'user',
            description: 'The member you want to mute.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'duration',
            description: 'The amount of time in minutes to mute.',
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for muting the user.',
            type: ApplicationCommandOptionType.String
        },
    ],

    callback: async(client, interaction) => {

        if (!interaction.inGuild()) {
            return interaction.reply({ content: 'You can only use this command inside servers!', ephemeral: true})
        };

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        const timeoutDuration = duration * 60 * 1000;

        if(!interaction.member?.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'You do not have permission to use that command.', ephemeral: true})
        };

        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'I am missing `ModerateMembers` permissions on this server.', ephemeral: true})
        };

        if (member) {
            if (member === interaction.guild.ownerId) {
              return interaction.reply({ content: 'I cannot mute the server owner.', ephemeral: true });
            };

            if (interaction.member?.roles.highest.position <= member.roles.highest.position) {
                return interaction.reply({ content: 'That user has a higher or equal role to you.', ephemeral: true });
              }
        
              if (interaction.guild.members.me.roles.highest.position <= member.roles.highest.position) {
                return interaction.reply({ content: 'That user has a higher or equal role to me.', ephemeral: true });
              }
           }

           const muteEmbed = new EmbedBuilder()
           .setColor('FF0000')
           .setTitle('User Muted')
           .setDescription(`${user} was successfully muted for ${duration} minutes.`)
           .addFields({ name: 'Reason', value: reason })
           .setTimestamp();

           try {
            await member.timeout(timeoutDuration, reason)
            await interaction.reply({ embeds: [muteEmbed] })
           } catch (error) {
            console.log(`There was an error muting that member ${error}`)
            interaction.reply({ content: 'There was an error muting that member', ephemeral: true})
           }
    },
};