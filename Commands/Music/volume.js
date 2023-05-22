const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("set the volume")
    .addNumberOption((option) => option.setName("volume").setDescription("the volume to set it to").setRequired(true)),
  async execute(interaction) {
    const channel = interaction.member.voice.channel;
    const volume = interaction.options.getNumber("volume");
    const player = interaction.client.player;
    const queue = player.nodes.get(interaction.guildId);
    if (!channel) return interaction.reply("You are not connected to a voice channel!");

    if (!queue || !queue.node.isPlaying()) {
      return interaction.reply("you are not in a vc");
    }

    await queue.node.setVolume(volume);

    interaction.reply(`volume set to **${volume}**`);
  },
};
