const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const warnModel = require("../../Model/Moderation/warns.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warns")
    .setDescription("See someone's warns.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) => option.setName("user").setDescription("The user to check").setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    const data = await warnModel.findOne({
      memberID: user.id,
    });

    if (data) {
      let i = 1;
      const embed = new EmbedBuilder().setTitle(`${user.username}'s warns`).setColor("FF0000");
      data.reasons.forEach((reason) => {
        embed.addFields({ name: `Warn ${i}:`, value: reason });
        i++;
      });
      interaction.reply({ embeds: [embed] });
    } else {
      interaction.reply("There are no warns for this user!");
    }
  },
};
