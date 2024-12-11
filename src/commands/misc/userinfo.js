const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'user-info',
    description: 'Get information for a selected user.',
    options: [
        {
            name: 'user',
            description: 'The user you want information for.',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],

    callback: async (client, interaction) => {

        const user = interaction.options.getUser('user') || interaction.user;

        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: 'That user is not in the server.', ephemeral: true });
        }


        const isBot = user.bot ? 'Yes' : 'No';
        const nickname = member.nickname || 'None';
        const presence = member.presence ? member.presence.status : 'Offline'

        let color = '#00ff00'

        let presenceIcon = 'Offline'

        if (presence === 'online') {
            presenceIcon = '<:onlinebadge:1281377172216483951>'
            color = '#00ff00'
        };

        if (presence === 'dnd') {
            presenceIcon = '<:dndbadge:1281377204504363089>'
            color = '#FF0000'
        };

        if (presence === 'idle') {
            presenceIcon = '<:idlebadge:1281377150456430652>'
            color = '#FFFF00'
        };

        if (presence === 'Offline') {
            color = '#808080'
        };


        const accountCreatedAt = user.createdAt.toDateString()

        const serverJoinedAt = member.joinedAt.toDateString()

        const joinedDaysAgo = Math.floor((Date.now() - member.joinedTimestamp) / (1000 * 60 * 60 * 24));

        let booster = 'No'

        if (member.premiumSince) {
            booster = 'Yes'
        }

        const roles = member.roles.cache
            .filter(role => role.id !== interaction.guild.id) // Exclude @everyone role
            .map(role => role.name)
            .join(', ') || 'None';

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(`${user.tag}'s information`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Username', value: user.username, inline: true },
                { name: 'Nickname', value: nickname, inline: true },
                { name: 'ID', value: user.id, inline: true },
                { name: 'Bot', value: isBot, inline: true },
                { name: 'Boosting', value: booster, inline: true },
                { name: 'Presence', value: presenceIcon, inline: true },
                { name: 'Created At', value: accountCreatedAt, inline: true },
                { name: 'Joined Server At', value: serverJoinedAt, inline: true },
                { name: 'Days Since Joining', value: `${joinedDaysAgo} days`, inline: true },
                { name: 'Roles', value: roles }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },
};