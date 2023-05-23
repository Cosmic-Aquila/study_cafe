const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("pause").setDescription("Pause a song"),
  async execute(interaction) {
    const player = interaction.client.player;
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return interaction.reply("you are not in a voice channel!");
    }
    const queue = player.nodes.get(interaction.guildId);

    if (!queue) return interaction.reply({ content: `no music currently playing `, ephemeral: true });

    if (queue.connection.paused) return interaction.reply({ content: "the track is currently paused!", ephemeral: true });
    queue.node.setPaused(true);
    return interaction.reply({ content: `${queue.current.title} paused` });
  },
};
