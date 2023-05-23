const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");
const muteModel = require("../../Model/Moderation/mutes.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) => option.setName("user").setDescription("The user to mute").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason for muting them").setRequired(true))
    .addStringOption((option) => option.setName("duration").setDescription("The length of their mute (5s, 5h, 5d, 5w)").setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const muteReason = interaction.options.getString("reason");
    const guild = await interaction.client.guilds.fetch(constantsFile.mainServerID);
    const member = guild.members.cache.get(user.id);
    const punishmentChannel = await guild.channels.fetch(constantsFile.punishmentChannel);
    const duration = interaction.options.getString("duration");
    const durationInMs = ms(duration);
    const formattedDuration = ms(durationInMs, { long: true });

    if (member.roles.cache.has(constantsFile.mainStaffrole) == false && member.moderatable) {
      try {
        member.roles.add(constantsFile.muteRole);
      } catch {
        interaction.reply({ content: "I could not mute that user!", ephemeral: true });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor("#ff7a70")
        .setTitle(`${user.tag} has been muted!`)
        .setDescription(
          `**User:** <@${user.id}>\n**Reason:** ${muteReason}\n**Duration:** ${formattedDuration}\n**Moderator:** ${interaction.user.tag}`
        );

      punishmentChannel.send({ embeds: [embed] });

      try {
        user.send(`You have been muted in **study cafe** for **${muteReason}**! You will be unmuted after ${formattedDuration}`);
      } catch {
        punishmentChannel.send("I was not able to DM the user!");
      }

      muteModel.create({ memberID: member.id, duration: duration, startedAt: new Date() });

      interaction.reply({ content: `User has been muted for ${formattedDuration}!`, ephemeral: true });
    } else if (member.roles.cache.has(constantsFile.mainStaffrole) == true) {
      interaction.reply("You can't mute a staff member!");
      return;
    } else if (member.moderatable == false) {
      interaction.reply({ content: "User is not muteable", ephemeral: true });
    }
  },
};
