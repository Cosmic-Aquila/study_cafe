const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption((option) => option.setName("song").setDescription("The song to play").setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const player = interaction.client.player;
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return interaction.followUp("You are not connected to a voice channel!");
    }

    const query = interaction.options.getString("song");

    try {
      const { track } = await player.play(channel, query, {
        nodeOptions: {
          metadata: interaction,
        },
      });

      return interaction.followUp(`**${track.title}** added to the queue!`);
    } catch (error) {
      console.error(error);
      return interaction.followUp("Something went wrong while playing the song.");
    }
  },
};
