const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'membercount',
    description: 'The number of members in the server',

    callback: async (client, interaction) => {

        if (!interaction.inGuild()) {
            return interaction.reply({ content: 'You can only use this command inside servers!', ephemeral: true})
        };

        const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Membercount')
        .setDescription(`${interaction.guild.memberCount}`)
        .setTimestamp();

        interaction.reply({ embeds: [embed] })
    },
};