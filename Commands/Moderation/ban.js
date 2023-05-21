const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) => option.setName("user").setDescription("The user ID to ban.").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason for banning the user.").setRequired(true))
    .addIntegerOption((option) => option.setName("days").setDescription("How many days of messages to clear").setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const userID = interaction.options.getString("user");
    const deleteDays = interaction.options.getInteger("days");
    const banReason = interaction.options.getString("reason");
    const guild = await interaction.client.guilds.fetch(constantsFile.mainServerID);
    const punishmentChannel = await guild.channels.fetch(constantsFile.punishmentChannel);

    try {
      await interaction.client.users.fetch(userID);
    } catch (error) {
      return interaction.editReply({
        content: "Invalid user ID.",
        ephemeral: true,
      });
    }

    try {
      const user = await interaction.client.users.fetch(userID, { force: true, cache: true });
      await guild.members.ban(userID, { reason: banReason, deleteMessageSeconds: deleteDays / 86400 });

      const embed = new EmbedBuilder()
        .setColor("#e35c54")
        .setTitle(`${user.tag} has been banned!`)
        .setDescription(`**User:** <@${user.id}>\n**Reason:** ${banReason}\n**Moderator:** ${interaction.user.tag}`);

      await punishmentChannel.send({ embeds: [embed] });
      return interaction.editReply({
        content: "User has been banned.",
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: "I could not ban that user.",
        ephemeral: true,
      });
    }
  },
};
