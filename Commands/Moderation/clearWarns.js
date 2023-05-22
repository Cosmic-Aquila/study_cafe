const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const warnModel = require("../../Model/Moderation/warns.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearwarns")
    .setDescription("clear all warns from a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) => option.setName("user").setDescription("The user to clear warns from").setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const guild = await interaction.client.guilds.fetch(constantsFile.mainServerID);
    const punishmentChannel = await guild.channels.fetch(constantsFile.punishmentChannel);
    const data = await warnModel.findOne({
      memberID: user.id,
    });
    if (data && data.reasons.length > 0) {
      const embed = new EmbedBuilder().setColor("#39dea8").setTitle("Warns Cleared");
      const reasons = data.reasons;

      let descriptionReasons = "";
      reasons.forEach((reason, index) => {
        descriptionReasons += `${index + 1}) ${reason}\n`;
      });
      embed.setDescription(`**Moderator:** ${interaction.user.tag}\n**User:** ${user.tag}\n**Reasons:**\n${descriptionReasons}`);

      await punishmentChannel.send({ embeds: [embed] });
      interaction.reply({ content: `Warns Cleared for ${user.username}!`, ephemeral: true });
      await warnModel.deleteMany({ memberID: user.id });
    } else {
      interaction.reply({ content: "There are no warns for this user!", ephemeral: true });
    }
  },
};
