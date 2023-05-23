const { EmbedBuilder } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(member) {
    if (member.guild.id !== constantsFile.mainServerID) return;

    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const joinedAt = member.user.createdTimestamp;

    if (joinedAt > oneMonthAgo) {
      const invites = await member.guild.invites.fetch();
      const inviteLink = await invites.find((invite) => invite.code);

      console.log(inviteLink.code);

      const punishmentChannel = await member.guild.channels.fetch(constantsFile.punishmentChannel);
      const logEmbed = new EmbedBuilder()
        .setTitle("Account Auto-Banned")
        .addFields(
          { name: "User:", value: member.user.username },
          { name: "Account Created At:", value: `${new Date(joinedAt).toLocaleDateString()}` },
          { name: "Invite:", value: inviteLink.code }
        );

      punishmentChannel.send({ embeds: [logEmbed] });
      member.ban({ days: 30, reason: "New Account (Auto Banned)" });
    } else {
      const welcomeChannel = await member.guild.channels.fetch(constantsFile.welcomeChannel);
      const embed = new EmbedBuilder()
        .setTitle(`wlc ${member.user.username}!`)
        .setDescription(`be sure to read <#${constantsFile.rulesChannel}> then come to <#${constantsFile.mainGeneralChat}>! enjoy your stay!`)
        .setColor("eec1ad");

      welcomeChannel.send({ content: `<@&${constantsFile.welcomePingRole}>`, embeds: [embed] });
      await member.roles.add(constantsFile.memberRole);
    }
  },
};
