const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField, } = require('discord.js');
const { testOnly } = require('../misc/ping');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  

  name: 'kick',
  description: 'Kicks a member from this server.',
  options: [
    {
      name: 'target-user',
      description: 'The user you want to kick.',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason you want to kick.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  
  callback: async(client, interaction) => {

    if (!interaction.inGuild()) {
      return interaction.reply({ content: 'You can only use this command inside servers!', ephemeral: true})
  };

    const reason = interaction.options.getString('reason') || 'No reason provided';
    const user = interaction.options.getUser('target-user');
    const member = interaction.guild.members.cache.get(user.id);

    const kickEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('User kicked')
      .setDescription(`${user} was succesfully kicked.`)
      .addFields (
        {name: 'Reason', value: reason}
      )
    .setTimestamp();

    const dmEmbed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('Kicked!')
    .setDescription(`You were kicked from ${interaction.guild.name}`)
    .addFields (
        { name: 'Reason', value: reason}
    )
    .setTimestamp();

      if (!member) {
      return interaction.reply({ content: "I couldn't find that user.", ephemeral: true })
      };

      if (member === interaction.guild.ownerId) {
       return interaction.reply({content: 'I can not kick the server owner.', ephemeral: true })
      };

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
    return interaction.reply ({content: 'You do not have permission to use that command.', ephemeral: true })
    };

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
     return interaction.reply ({content: 'I am missing `KickMembers` permissions on this server.', ephemeral: true })
    };

    if (interaction.member?.roles.highest.position <= member.roles.highest.position) {
    return interaction.reply({content: 'That user has a higher or equal role to you.', ephemeral: true })
    };

    if (interaction.guild.members.me.roles.highest.position <= member.roles.highest.position) {
    return interaction.reply ({content: 'That user has a higher or equal role to me.', ephemeral: true })
    };

    try { 
      await member.kick({ reason })
      return interaction.reply({embeds: [kickEmbed] });
      
    } catch (error) {
      console.log(error)
      interaction.reply({ content: 'There was an error when kicking that user.', ephemeral: true })
    };

    try {
        await user.send({ embeds: [dmEmbed] })
    } catch (error) {
       console.log(`An error occured while kicking that user ${error}`)
       return interaction.reply({content: 'I could not send a DM to that user', ephemeral: true })
    };
    
  },
};