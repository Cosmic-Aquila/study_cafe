const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("resume").setDescription("Resume a song"),
  async execute(interaction) {
    const player = interaction.client.player;
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return interaction.reply("you are not in a voice channel!");
    }
    const queue = player.nodes.get(interaction.guildId);

    if (!queue) return interaction.reply({ content: `no music currently playing `, ephemeral: true });

    if (queue.connection.playing) return interaction.reply({ content: "the track is currently playing!", ephemeral: true });
    queue.node.setPaused(false);
    return interaction.reply({ content: `${queue.currentTrack.title} resumed` });
  },
};
