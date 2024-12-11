const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  /**
   * 
   * @param {Client} client
   * @param {Interaction} interaction
   */

  name: 'ban',
  description: 'Bans a member from this server by user, mention, or ID.',
  options: [
    {
      name: 'target-user',
      description: 'The user you want to ban (mention or ID).',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason you want to ban.',
      type: ApplicationCommandOptionType.String,
    },
  ],

  callback: async(client, interaction) => {
    
    if (!interaction.inGuild()) {
      return interaction.reply({ content: 'You can only use this command inside servers!', ephemeral: true})
  };


    const reason = interaction.options.getString('reason') || 'No reason provided';
    const targetUserInput = interaction.options.getString('target-user');

    // Handle mention or ID
    let user;
    if (targetUserInput.match(/^<@!?(\d+)>$/)) {
      // If input is a mention, extract the ID
      user = await client.users.fetch(targetUserInput.match(/^<@!?(\d+)>$/)[1]);
    } else if (targetUserInput.match(/^\d+$/)) {
      // If input is a user ID
      user = await client.users.fetch(targetUserInput);
    } else {
      return interaction.reply({ content: "Invalid input. Please provide a mention or user ID.", ephemeral: true });
    }

    const member = interaction.guild.members.cache.get(user.id);

    const banEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('User Banned')
      .setDescription(`${user} was successfully banned.`)
      .addFields({ name: 'Reason', value: reason })
      .setTimestamp();

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: 'You do not have permission to use that command.', ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: 'I am missing `BanMembers` permissions on this server.', ephemeral: true });
    }

    if (member) {
      if (member === interaction.guild.ownerId) {
        return interaction.reply({ content: 'I cannot ban the server owner.', ephemeral: true });
      };

      if (interaction.member?.roles.highest.position <= member.roles.highest.position) {
        return interaction.reply({ content: 'That user has a higher or equal role to you.', ephemeral: true });
      }

      if (interaction.guild.members.me.roles.highest.position <= member.roles.highest.position) {
        return interaction.reply({ content: 'That user has a higher or equal role to me.', ephemeral: true });
      }
    }

    try {
      await interaction.guild.members.ban(user.id, { reason });
      await interaction.reply({ embeds: [banEmbed] });
    } catch (banError) {
      console.log(`There was an error: ${banError}`);
      return interaction.reply({ content: 'There was an error when banning that user.', ephemeral: true });
    }
  },
};