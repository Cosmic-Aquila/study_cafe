const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");
const { deploy } = require("./deploy.js");
const { Player } = require("discord-player");

deploy();

// Require handler files to load commands/events
const { loadEvents } = require("./Functions/Handlers/events.js");
const { loadCommands } = require("./Functions/Handlers/commands.js");

// Be sure to include intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();
client.config = require("./Storage/config.json");

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

async function loadExtractors(client) {
  await client.player.extractors.loadDefault();
}
loadExtractors(client);

module.exports = { client };

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

// Login then load commands and events
client
  .login(client.config.token)
  .then(() => {
    loadEvents(client);
    loadCommands(client);
  })
  .catch((error) => {
    console.error(error);
  });
