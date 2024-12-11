const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Provides helpful information about the bot and features of the bot.',

    callback: async (clinet, interaction) => {

        const helpEmbed = new EmbedBuilder()
        .setColor('00ff00')
        .addFields(
            { name: 'Bot Invite: ', value: '[Invite](https://discord.com/oauth2/authorize?client_id=1263284317908631563&permissions=1649670127622&integration_type=0&scope=bot+applications.commands)' },
            { name: 'Bot Invite (Admin):', value: '[Invite](https://discord.com/oauth2/authorize?client_id=1263284317908631563&permissions=8&integration_type=0&scope=bot+applications.commands)' },
            { name: 'Support Server:', value: 'https://discord.gg/5cu4NK3Dan' }
            
        )

        await interaction.reply({ embeds: [helpEmbed] });

    },
};