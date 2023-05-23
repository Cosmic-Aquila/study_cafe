const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("skip").setDescription("skip a song"),
  async execute(interaction) {
    const channel = interaction.member.voice.channel;
    const player = interaction.client.player;
    const queue = player.nodes.get(interaction.guildId);
    if (!channel) return interaction.reply("You are not connected to a voice channel!");

    if (!queue || !queue.node.isPlaying()) {
      return interaction.reply("no queue/not playing");
    }

    const currentTrack = queue.currentTrack;
    await queue.node.skip();

    interaction.reply(`skipped **${currentTrack}**`);
  },
};
