const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'softban',
    description: 'Ban and immediately unban a member to remove their recent messages.',
    options: [
        {
            name: 'user',
            description: 'The user you want to softban.',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for soft banning the user.',
            type: ApplicationCommandOptionType.String,
        },
        {
          name: 'invite',
          description: 'Send a DM containing the server invite.',
          type: ApplicationCommandOptionType.Boolean,
        },
    ],

    callback: async (client, interaction) => {

      if (!interaction.inGuild()) {
        return interaction.reply({ content: 'You can only use this command inside servers!', ephemeral: true})
    };

        const targetUserInput = interaction.options.getString('user');
        const sendInvite = interaction.options.getBoolean('invite');

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
    const reason = interaction.options.getString('reason') || 'No reason provided.';

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return interaction.reply({ content: 'You do not have permission to use that command.', ephemeral: true });
      };
  
      if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return interaction.reply({ content: 'I am missing `BanMembers` permissions on this server.', ephemeral: true });
      };
  
      if (member) {
        if (member === interaction.guild.ownerId) {
          return interaction.reply({ content: 'I cannot ban the server owner.', ephemeral: true });
        };
  
        if (interaction.member?.roles.highest.position <= member.roles.highest.position) {
          return interaction.reply({ content: 'That user has a higher or equal role to you.', ephemeral: true });
        };
  
        if (interaction.guild.members.me.roles.highest.position <= member.roles.highest.position) {
          return interaction.reply({ content: 'That user has a higher or equal role to me.', ephemeral: true });
        };

        if (sendInvite && !interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)) {
          return interaction.reply({ constent: 'I am missing `CreateInvite` permissions on this server.', ephemeral: true })
        };
      }

      const banEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('User Soft Bannned')
      .setDescription(`${user.tag} was successfully soft banned.`)
      .addFields({ name: 'Reason', value: reason })
      .setTimestamp();


    try {

      //Wrapped in try catch to see if the user is accepting DMs
      try {
        if (sendInvite) {
          const newInvite = await interaction.channel.createInvite({maxAge: 10 * 60 * 1000, maxUses: 1})
          await member.send(`Here is your new invite: ${newInvite.url}`)
        };
       } catch (error) {
        await interaction.reply({ content: 'I cannot send dms to that user.', ephemeral: true })
       }

    
       await interaction.guild.members.ban(member, {deleteMessageSeconds: 604800}, {reason});
       await interaction.guild.bans.remove(member)
       await interaction.reply({embeds: [banEmbed]});
       
    } catch (error) {
        console.log(`Error when soft banning that user ${error}`)
        return interaction.reply({ content: 'An error occured when soft banning that user.', ephemeral: true })
    }

    },
};