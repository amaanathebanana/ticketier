const { Client, GatewayIntentBits, Partials, Collection, Guild, IntentsBitField } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const config = require("./config.json");
const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessageReactions, IntentsBitField.Flags.GuildMembers],
    partials: [User, Message, GuildMember, ThreadMember]
}); 
const { loadInteractions } = require("./src/handlers/interactionHandler")
client.commands = new Collection();
client.events = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
loadInteractions(client)

client.login(config.token)