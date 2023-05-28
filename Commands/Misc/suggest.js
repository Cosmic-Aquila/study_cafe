const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");
const suggestionModel = require("../../Model/suggestions.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Suggest something for the server.")
    .addStringOption((option) => option.setName("suggestion").setDescription("Your suggestion").setRequired(true)),
  async execute(interaction, client) {
    const suggestion = interaction.options.getString("suggestion");
    const guild = await client.guilds.fetch(constantsFile.mainServerID);
    const channel = await guild.channels.fetch(constantsFile.suggestionChannel);

    const highestSuggestion = await suggestionModel.findOne().sort({ suggestionID: -1 });
    const suggestionID = highestSuggestion ? highestSuggestion.suggestionID + 1 : 1;

    const embed = new EmbedBuilder()
      .setColor("#eec1ad")
      .addFields({ name: `suggestion from ${interaction.user.username}`, value: suggestion })
      .setFooter({ text: `suggestion id: ${suggestionID}` });
    const suggestMsg = await channel.send({ content: constantsFile.suggestionPingRole, embeds: [embed] });
    suggestMsg.react("👍");
    suggestMsg.react("👎");
    await suggestionModel.create({
      messageID: suggestMsg.id,
      suggestionID: suggestionID,
      memberID: interaction.user.id,
    });
    interaction.reply(`suggestion sent to <#${constantsFile.suggestionChannel}>!`);
  },
};
