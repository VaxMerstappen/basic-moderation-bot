module.exports = {
    name: 'dice',
    description: 'Roll a dice',

    callback: async (client, interaction) => {

   const result = Math.floor(Math.random() * 6) + 1;

   await interaction.reply(`You rolled ${result}`)

    },
};