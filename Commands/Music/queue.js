const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { pagination, ButtonTypes, ButtonStyles } = require("@devraelfreeze/discordjs-pagination");

module.exports = {
  data: new SlashCommandBuilder().setName("queue").setDescription("list the queue"),
  async execute(interaction) {
    await interaction.deferReply();
    const player = interaction.client.player;
    const channel = interaction.member.voice.channel;
    const queue = player.nodes.get(interaction.guildId);

    if (!queue || !queue.node.isPlaying()) {
      return interaction.followUp("there is no queue or nothing is playing!");
    }
    if (!channel) {
      return interaction.followUp("you are not in a vc!");
    }

    const tracks = queue.tracks.toArray();
    const arrayTracks = [`**1 - ${queue.currentTrack.title} | ${queue.currentTrack.author}**`];
    if (tracks) {
      let numbering = 2;
      for (let i = 0; i < tracks.length; i++) {
        arrayTracks.push(`**${numbering} - ${tracks[i].title} | ${tracks[i].author}**`);
      }
      numbering++;
    }

    const pages = [];
    for (let i = 0; i < arrayTracks.length; i += 10) {
      const pageTracks = arrayTracks.slice(i, i + 10);

      const embed = new EmbedBuilder()
        .setTitle("Queue")
        .setDescription(pageTracks.join("\n"))
        .setColor("#0099ff")
        .setFooter({ text: `Page ${Math.floor(i / 10) + 1}/${Math.ceil(arrayTracks.length / 10)}` });

      pages.push(embed);
    }
    if (pages.length > 1) {
      await pagination({
        embeds: pages,
        author: interaction.member.user,
        interaction: interaction,
        ephemeral: true,
        time: 30000,
        disableButtons: true,
        fastSkip: false,
        pageTravel: false,
        buttons: [
          {
            value: ButtonTypes.previous,
            label: "Previous",
            style: ButtonStyles.Primary,
          },
          {
            value: ButtonTypes.next,
            label: "Next",
            style: ButtonStyles.Success,
          },
        ],
      });
    } else {
      interaction.followUp({
        embeds: [pages[0]],
        ephemeral: true,
      });
    }
  },
};
