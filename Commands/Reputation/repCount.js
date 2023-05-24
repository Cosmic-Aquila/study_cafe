const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const rep = require("../../Model/repBalance.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("repcount")
    .setDescription("Get someone's rep count.")
    .addUserOption((option) => option.setName("target").setDescription("The user's rep count to show")),
  async execute(interaction) {
    const providedUser = interaction.options.getUser("target");
    const user = providedUser ?? interaction.user;
    let data = await rep.findOne({
      guildID: interaction.guild.id,
      memberID: user.id,
    });
    if (data) {
      let embed = new EmbedBuilder()
        .setTitle(`${user.username}'s rep points!`)
        .setColor("#eec1ad")
        .addFields({ name: "reps:", value: `${data.repAmount}` });
      return interaction.reply({ embeds: [embed] });
    } else {
      return interaction.reply("There was no data found for this user.");
    }
  },
};
