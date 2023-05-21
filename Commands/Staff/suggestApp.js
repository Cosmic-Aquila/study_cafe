const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");
const suggestionModel = require("../../Model/suggestions.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggestapp")
    .setDescription("Decide on a suggestion!")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) => option.setName("id").setDescription("The id of the suggestion").setRequired(true))
    .addBooleanOption((option) => option.setName("accept").setDescription("Do you want to accept it?").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason for denying")),
  async execute(interaction) {
    const suggestionID = interaction.options.getString("id");
    const decision = interaction.options.getBoolean("accept");
    const reason = interaction.options.getString("reason") ?? "no reason provided";
    const guild = await interaction.client.guilds.fetch(constantsFile.mainServerID);
    const suggestionChannel = await guild.channels.fetch(constantsFile.suggestionChannel);
    let decisionText = "accepted";
    const suggestion = await suggestionModel.findOne({ suggestionID: suggestionID });

    if (!suggestion) {
      return interaction.reply("No suggestion with that ID!");
    }

    if (decision === false) {
      decisionText = "denied";
    }

    suggestionChannel.send(`<@${suggestion.memberID}> your suggestion with id ${suggestionID} has been ${decisionText} for ${reason}`);
    interaction.reply("Suggestion decision sent!");
  },
};
