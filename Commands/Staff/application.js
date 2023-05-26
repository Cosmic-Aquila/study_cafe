const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");
const applicationsModel = require("../../Model/Staff/applications.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("application")
    .setDescription("Decide on a application!")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) => option.setName("id").setDescription("The id of the user").setRequired(true))
    .addBooleanOption((option) => option.setName("accept").setDescription("Accept (true) or Deny (false) the request").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason for your decision")),
  async execute(interaction) {
    const guild = await interaction.client.guilds.fetch(constantsFile.mainServerID);
    const id = interaction.options.getString("id");
    let reason = interaction.options.getString("reason");
    const decision = interaction.options.getBoolean("accept");

    const data = await applicationsModel.findOne({ memberID: id });

    if (!reason) {
      reason = "\n";
    } else if (reason) {
      reason = "for " + reason + "\n";
    }

    if (data && decision == true) {
      const applicant = await guild.members.fetch(id);
      applicant.send(
        `Congratulations on being accepted into the study cafe staff team ${applicant.user.username} Please follow this link https://discord.gg/GdSD8GubY4 to join the staff server`
      );
      interaction.reply({ content: "User Accepted", ephemeral: true });
    } else if (data && decision == false) {
      const applicant = await guild.members.fetch(id);
      applicant.send(
        `Unfortunately your staff application has been denied ${reason} Please feel free to reapply at a later date\n -study cafe Senior Staff`
      );
      interaction.reply({ content: "User Denied", ephemeral: true });
    } else if (!data) {
      interaction.reply("No application found for a user with that ID");
    }
  },
};
