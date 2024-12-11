const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'echo',
    description: 'Make the bot say something in chat.',
    options: [
        {
            name: 'message',
            description: 'What you want the bot to say',
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],

    callback: async (client, interaction) => {

        const message = interaction.options.getString('message')

        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
            return interaction.reply({ content: 'I am missing `SendMessages` permissions on this server.', ephemeral: true })
        };

        if (!interaction.member?.permissions.has(PermissionsBitField.Flags.SendMessages)) {
            return interaction.reply({ content: 'You do not have permission to use that command.', ephemeral: true })
        };

        try {
            await interaction.channel.send(message)
            return interaction.reply({ content: 'Succesfully sent message', ephemeral: true })
        } catch (error) {
            await interaction.reply({ content: 'There was an error when echoing the message', ephemeral: true })
            return console.log(`There was an error ${error}`)
        }
    },
};