const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("shuffle").setDescription("shuffle the songs"),
  async execute(interaction) {
    const channel = interaction.member.voice.channel;
    const player = interaction.client.player;
    const queue = player.nodes.get(interaction.guildId);
    if (!channel) return interaction.reply("you are not connected to a voice channel!");

    if (!queue || !queue.node.isPlaying()) {
      return interaction.reply("you are not in a vc");
    }

    await queue.tracks.shuffle();

    interaction.reply(`queue shuffled`);
  },
};
