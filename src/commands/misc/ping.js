const { EmbedBuilder } = require('discord.js') 

module.exports = {
    name: 'ping',
    description: 'Pong!',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],
    // deleted: Boolean,
  
    callback: (client, interaction) => {

      const embed = new EmbedBuilder()
      .setColor('00ff00')
      .setTitle(':ping_pong: Pong!')
      .setDescription(`The websocket ping is ${client.ws.ping}ms`);
      

      interaction.reply({ embeds: [embed]})
    },
  };

  //Follow this command format