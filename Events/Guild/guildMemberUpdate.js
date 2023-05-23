const constantsFile = require("../../Storage/constants.js");

module.exports = {
  name: "guildMemberUpdate",
  once: false,
  async execute(oldMember, newMember) {
    if (oldMember.guild.id !== constantsFile.mainServerID) {
      return;
    }
    const mainChat = await newMember.guild.channels.fetch(constantsFile.mainGeneralChat);
    if (!oldMember.roles.cache.has(constantsFile.boosterRole) && newMember.roles.cache.has(constantsFile.boosterRole)) {
      mainChat.send(`thanks for boosting <@${newMember.id}>!\n**perks:**\n- custom role\n- bot of your choice\n- no cooldown on helper cmd`);
    }
  },
};
