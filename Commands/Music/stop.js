const { SlashCommandBuilder } = require("discord.js");
const { clientId } = require("../../Storage/config.json");

module.exports = {
  data: new SlashCommandBuilder().setName("stop").setDescription("skip a song"),
  async execute(interaction) {
    const channel = interaction.member.voice.channel;
    const player = interaction.client.player;
    const queue = player.nodes.get(interaction.guildId);
    if (!channel) return interaction.reply("You are not connected to a voice channel!");

    if (!queue || !queue.node.isPlaying()) {
      return interaction.reply("no queue/not playing");
    }
    await player.nodes.delete(interaction.guild.id);

    const member = await interaction.guild.members.fetch(clientId);

    console.log(member);

    member.voice.disconnect();
    interaction.reply(`queue stopped`);
  },
};
