const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const pointsModel = require("../../Model/Pomodoro/minutes.js");
const ordinal = (num) => `${num.toLocaleString("en-US")}${[, "st", "nd", "rd"][(num / 10) % 10 ^ 1 && num % 10] || "th"}`;
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder().setName("pointslb").setDescription("Check the pomdoro lb."),
  async execute(interaction) {
    const lb = await pointsModel.find({}).sort({ points: -1 }).limit(10);
    const guild = await interaction.client.guilds.fetch(constantsFile.mainServerID);
    if (lb.length === 0) {
      interaction.reply("No Data!");
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "study cafe pomodoro lb",
        iconURL: guild.iconURL({ extension: "png" }),
      })
      .setColor("#eec1ad")
      .setFooter({ text: "1 minute = .2 points" });

    for (let i = 0; i < lb.length; i++) {
      const memberID = lb[i].memberID;
      const name = await guild.members
        .fetch(memberID)
        .then((member) => member.user.username)
        .catch(() => null);
      if (name) {
        embed.addFields({ name: `${ordinal(i + 1)}. ${name}`, value: `**points:** ${lb[i].points.toFixed(1)}` });
      }
    }

    return interaction.reply({ embeds: [embed] });
  },
};
