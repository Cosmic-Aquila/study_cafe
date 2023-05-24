const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const messageModel = require("../../Model/messages.js");
const ordinal = (num) => `${num.toLocaleString("en-US")}${[, "st", "nd", "rd"][(num / 10) % 10 ^ 1 && num % 10] || "th"}`;
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder().setName("messagelb").setDescription("Check the message lb."),
  async execute(interaction) {
    const lb = await messageModel.find({}).sort({ messages: -1 }).limit(10);
    const guild = await interaction.client.guilds.fetch(constantsFile.mainServerID);
    if (lb.length === 0) {
      interaction.reply("No Data!");
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "study cafe message lb",
        iconURL: guild.iconURL({ extension: "png" }),
      })
      .setColor("#eec1ad");

    for (let i = 0; i < lb.length; i++) {
      const memberID = lb[i].memberID;
      const name = await guild.members
        .fetch(memberID)
        .then((member) => member.user.username)
        .catch(() => null);
      if (name) {
        embed.addFields({ name: `${ordinal(i + 1)}. ${name}`, value: `**messages:** ${lb[i].messages}` });
      }
    }

    return interaction.reply({ embeds: [embed] });
  },
};
