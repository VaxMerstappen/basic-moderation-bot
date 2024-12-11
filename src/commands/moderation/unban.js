const { ApplicationCommandOptionType, Application, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Unban a member from the server',
    options: [
        {
            name: 'user-id',
            description: 'The ID of the user you want to unban',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'reason',
            description: 'Reason for unbanning',
            type: ApplicationCommandOptionType.String,
            required: false

        }
    ],

    callback: async(client, interaction) => {

        if (!interaction.inGuild()) {
            return interaction.reply({ content: 'You can only use this command inside servers!', ephemeral: true})
        };

    const reason = interaction.options.getString('reason') || 'No reason provided';
    const user = interaction.options.getString('user-id');

    await interaction.deferReply();

    if(!user) {
       return interaction.reply({ content: 'I could not find that user.', ephemeral: true })
    }

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.editReply({ content: 'You do not have permission to use that command.', ephemeral: true })
    };

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.editReply({ content: 'I am missing `BanMembers` permissions on this server.', ephemeral: true })
    };

    try {
       const bannedUser = await interaction.guild.bans.fetch(user).catch(() => null);
        if (!bannedUser) {
            return interaction.editReply({ content: 'This user is not banned.', ephemeral: true });
        };

        await interaction.guild.bans.remove(user, reason)

        const unbanEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('User unbanned')
        .setDescription(`User with ID ${user} was unbanned`)
        .addFields(
            {name: 'Reason', value: reason}
        )
        .setTimestamp();
            
      await  interaction.editReply({ embeds: [unbanEmbed] })
    } catch (error) {
        console.log(`There was an error when unbanning the user ${error}.`)
        interaction.reply({ content: 'An error occured when unbanning the user.', ephemeral: true })
    }
   },
};