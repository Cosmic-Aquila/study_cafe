const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("init").setDescription("For the open/close channel system!"),
  async execute(interaction) {
    interaction.channel.send("**Use these:**");
    interaction.channel.send("**Don't use these:**");
  },
};
