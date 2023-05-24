const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const repModel = require("../../Model/repBalance.js");
const ordinal = (num) => `${num.toLocaleString("en-US")}${[, "st", "nd", "rd"][(num / 10) % 10 ^ 1 && num % 10] || "th"}`;
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder().setName("replb").setDescription("Check the rep lb."),
  async execute(interaction) {
    const guild = await interaction.client.guilds.fetch(constantsFile.mainServerID);
    const lb = await repModel.find({}).sort({ repAmount: -1 }).limit(10);
    if (lb.length === 0) {
      interaction.reply("No Data!");
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "study cafe Reputation lb",
        iconURL: guild.iconURL({ extension: "png" }),
      })
      .setColor("#eec1ad");

    for (let i = 0; i < lb.length; i++) {
      const memberID = lb[i].memberID;
      const name = await interaction.guild.members
        .fetch(memberID)
        .then((member) => member.user.username)
        .catch(() => null);
      if (name) {
        embed.addFields({ name: `${ordinal(i + 1)}. ${name}`, value: `**reps:** ${lb[i].repAmount}` });
      }
    }

    return interaction.reply({ embeds: [embed] });
  },
};
