const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Get the bot ping."),
  async execute(interaction) {
    interaction.reply(`ping: ${Date.now() - interaction.createdTimestamp} ms\n\nWS Ping: ${interaction.client.ws.ping} ms`);
  },
};
