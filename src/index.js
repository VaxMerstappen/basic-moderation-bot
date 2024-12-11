require('dotenv').config();
const { Client, IntentsBitField, REST, Routes } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences
  ],
});

(async () =>  {
 try { 

 eventHandler(client);

 client.login(process.env.TOKEN);
 } catch (error) { 
    console.log(`Error ${error}`)
 }
})();




