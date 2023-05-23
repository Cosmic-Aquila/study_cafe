const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) => option.setName("user").setDescription("The user to kick").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason for kicking them").setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const kickReason = interaction.options.getString("reason");
    const guild = await interaction.client.guilds.fetch(constantsFile.mainServerID);
    const member = guild.members.cache.get(user.id);
    const punishmentChannel = await guild.channels.fetch(constantsFile.punishmentChannel);

    if (member.roles.cache.has(constantsFile.mainStaffrole) == false && member.kickable) {
      try {
        member.kick();
      } catch {
        interaction.reply({ content: "I could not kick that user!", ephemeral: true });
        return;
      }
      const embed = new EmbedBuilder()
        .setColor("##ff7a70")
        .setTitle(`${user.tag} has been kicked!`)
        .setDescription(`**User:** <@${user.id}>\n**Reason:** ${kickReason}\n**Moderator:** ${interaction.user.tag}`);

      punishmentChannel.send({ embeds: [embed] });

      interaction.reply({ content: "User has been kicked!", ephemeral: true });
    } else if (member.roles.cache.has(constantsFile.mainStaffrole) == true) {
      interaction.reply("You can't kick a staff member!");
      return;
    } else if (member.kickable == false) {
      interaction.reply({ content: "User is not kickable", ephemeral: true });
    }

    try {
      user.send(`You have been kicked from **study cafe** for **${kickReason}**!`);
    } catch {
      punishmentChannel.send("I was not able to DM the user!");
    }
  },
};
