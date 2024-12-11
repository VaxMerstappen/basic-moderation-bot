const { EmbedBuilder, Interaction, Client, Guild, ChannelType } = require('discord.js');

module.exports = {

    name: 'server-info',
    description: 'Get info on the server',
    
    callback: async (client, interaction, guild) => {

        if (!interaction.inGuild()) {
            return interaction.reply({ content: 'You can only use this command inside servers!', ephemeral: true})
        };
   
        const channelSize = (await interaction.guild.channels.fetch())
        .filter( (channel) => channel.type !== ChannelType.GuildCategory).size;

        const categories = (await interaction.guild.channels.fetch())
        .filter( (channel) => channel.type === ChannelType.GuildCategory).size;

        const roles = (await interaction.guild.roles.fetch()).size;
        
        const boosts = interaction.guild.premiumSubscriptionCount;
        const boostTier = interaction.guild.premiumTier;
        const vanity = interaction.guild.vanityURLCode || 'None';
        const createdAt = interaction.guild.createdAt.toDateString();
       

        const serverEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle(`${interaction.guild.name} info`)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .addFields(
            { name: 'Name', value: interaction.guild.name, inline: true },
            { name: 'ID', value: interaction.guild.id, inline: true },
            { name: 'Created at', value: createdAt, inline: true },
            { name: 'Owner ID', value: interaction.guild.ownerId, inline: true },
            { name: 'Members', value: `${interaction.guild.memberCount}`, inline: true },
            { name: 'Channels', value: `${channelSize}`, inline: true },
            { name: 'Categories', value: `${categories}`, inline: true },
            { name: 'Roles', value: `${roles}`, inline: true },
            { name: 'Vanity', value: vanity, inline: true },          
            { name: 'Boosts', value: `${boosts}`, inline: true },
            { name: 'Boost Tier', value: `${boostTier}`, inline: true },
        )
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

        await interaction.reply({ embeds: [serverEmbed] });
    },
};

