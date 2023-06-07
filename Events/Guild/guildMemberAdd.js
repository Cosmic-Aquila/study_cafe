const { EmbedBuilder } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");
const applicationModel = require("../../Model/Staff/applications.js");
const { client } = require("../../index.js");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(member) {
    if (member.guild.id === constantsFile.mainServerID) {
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
        if (!member.user.bot) {
          await member.roles.add(constantsFile.memberRole);
        } else if (member.user.bot) {
          await member.roles.add(constantsFile.botRole);
        }
        await member.guild.members
          .fetch()
          .then((members) => {
            const memberCount = members.filter((member) => !member.user.bot).size;

            client.user.setPresence({
              activities: [{ name: `Helping ${memberCount} customers!`, type: ActivityType.Playing }],
              status: "online",
            });
          })
          .catch(console.error);
      }
    } else if (member.guild.id === constantsFile.staffServerID) {
      const data = await applicationModel.findOne({ memberID: member.id });

      if (!member.user.bot && !data && member.kickable) {
        await member.kick();
      }

      try {
        const guild = await client.guilds.fetch(constantsFile.mainServerID);
        var mainMember = await guild.member.fetch(message.author.id);
      } catch {
        if (!member.user.bot && member.kickable) {
          await member.kick();
        }
      }
      const welcomeChannel = await member.guild.channels.fetch(constantsFile.staffWelcomeChannel);
      let toRead;
      if (data.type === "mod") {
        toRead = constantsFile.modGuideChannel;
        await member.roles.add(constantsFile.staffJrMod);
        await member.roles.add(constantsFile.staffModTeam);
        await mainMember.roles.add(constantsFile.mainStaffrole);
        await mainMember.roles.add(constantsFile.mainJrMod);
        await mainMember.roles.add(constantsFile.mainModTeam);
      } else if (data.type === "tutor") {
        toRead = constantsFile.tutorGuideChannel;
        await member.roles.add(constantsFile.staffTrialTutor);
        await member.roles.add(constantsFile.staffTutorTeam);
        await mainMember.roles.add(constantsFile.mainTrialTutor);
        await mainMember.roles.add(constantsFile.mainStaffrole);
      }
      const embed = new EmbedBuilder()
        .setTitle(`wlc ${member.user.username}!`)
        .setDescription(`be sure to read <#${toRead}> then come to <#${constantsFile.mainGeneralChat}>! enjoy your stay!`)
        .setColor("eec1ad");

      welcomeChannel.send({ embeds: [embed] });
      await applicationModel.findOneAndDelete({ memberID: member.id });
    }
  },
};
