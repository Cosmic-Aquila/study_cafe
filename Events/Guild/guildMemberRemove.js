const messageModel = require("../../Model/messages.js");
const expModel = require("../../Model/Levels/exp.js");
const repCooldown = require("../../Model/Cooldowns/repCooldown.js");
const helperCooldown = require("../../Model/Cooldowns/helperPing.js");
const repModel = require("../../Model/repBalance.js");
const muteModel = require("../../Model/Moderation/mutes.js");

module.exports = {
  name: "guildMemberRemove",
  once: false,
  async execute(member) {
    console.log(`${member.id} has left the server`);
    console.log(member.guild.id);
    if (member && member.guild.id == "1040773239607140485") {
      await messageModel.findOneAndDelete({ memberID: member.id });
      await expModel.findOneAndDelete({ memberID: member.id });
      await repCooldown.findOneAndDelete({ memberID: member.id });
      await helperCooldown.findOneAndDelete({ memberID: member.id });
      await repModel.findOneAndDelete({ memberID: member.id });
      await muteModel.findOneAndDelete({ memberID: member.id });
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
  },
};
