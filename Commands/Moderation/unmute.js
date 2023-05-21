const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");
const muteModel = require("../../Model/Moderation/mutes.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) => option.setName("user").setDescription("The user to unmute").setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const guild = await interaction.client.guilds.fetch(constantsFile.mainServerID);
    const member = guild.members.cache.get(user.id);
    const punishmentChannel = await guild.channels.fetch(constantsFile.punishmentChannel);
    if (member.roles.cache.has(constantsFile.muteRole)) {
      if (member.moderatable) {
        try {
          member.roles.remove(constantsFile.muteRole);
        } catch {
          interaction.reply({ content: "I could not unmute that user!", ephemeral: true });
          return;
        }
        const embed = new EmbedBuilder()
          .setColor("#39dea8")
          .setTitle(`User unmuted`)
          .setDescription(`**Moderator:** ${interaction.user.tag}\n**User:** ${user.tag}`);

        punishmentChannel.send({ embeds: [embed] });

        muteModel.findOneAndDelete({ memberID: member.id });

        interaction.reply({ content: `User has been unmuted`, ephemeral: true });
      }
    } else {
      interaction.reply({ content: `User is not muted`, ephemeral: true });
    }
  },
};
