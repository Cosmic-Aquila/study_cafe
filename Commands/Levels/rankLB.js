const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const expModel = require("../../Model/Levels/exp.js");
const ordinal = (num) => `${num.toLocaleString("en-US")}${[, "st", "nd", "rd"][(num / 10) % 10 ^ 1 && num % 10] || "th"}`;

module.exports = {
  data: new SlashCommandBuilder().setName("ranklb").setDescription("Check the xp lb."),
  async execute(interaction) {
    const guild = await interaction.client.guilds.fetch(constantsFile.mainServerID);
    const lb = await expModel.find({}).sort({ level: -1, xp: -1 }).limit(10);
    if (lb.length === 0) {
      return interaction.reply("No Data!");
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "study cafe xp lb",
        iconURL: guild.iconURL({ extension: "png" }),
      })
      .setColor("#8ef1ec");

    for (let i = 0; i < lb.length; i++) {
      const memberID = lb[i].memberID;
      const name = await interaction.guild.members
        .fetch(memberID)
        .then((member) => member.user.username)
        .catch(() => null);
      if (name) {
        embed.addFields({ name: `${ordinal(i + 1)}. ${name}`, value: `**level:** ${lb[i].level}` });
      }
    }

    return interaction.reply({ embeds: [embed] });
  },
};
