const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("done").setDescription("Standard Message"),
  async execute(interaction) {
    interaction.channel.send(
      "If you're done using this channel please use `/end` or, if not ignore this. If you decide to end please consider using `/rep` and `/review`."
    );
    interaction.reply({ content: "Sent", ephemeral: true });
  },
};
