const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'embed-builder',
    description: 'Build a custom embed',
    options: [
        {
            name: 'color',
            description: 'The color of your embed (HEX)',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
           name: 'title',
           description: 'The title of your embed',
           type: ApplicationCommandOptionType.String,
           required: true
        },
        {
            name: 'description',
            description: 'The description of your embed',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    callback: async (client, interaction) => {

        const color = interaction.options.getString('color')
        const title = interaction.options.getString('title')
        const description = interaction.options.getString('description')

        const isValidHexColor = /^#?([A-Fa-f0-9]{6})$/.test(color)

        if (!isValidHexColor) {
            return interaction.reply({ content: 'Please enter a valid hex color', ephemeral: true })
        }
        
    
        const customEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        try {
            await  interaction.channel.send ({ embeds: [customEmbed] })
            await interaction.reply({ content: 'Succesfully sent embed', ephemeral: true})
        } catch (error) {
            console.log(`There was an error ${error}`)
             return interaction.reply({ content: 'An error occured when sending the embed', ephemeral: true})
        }
        
    },
};