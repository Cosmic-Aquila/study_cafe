const messageModel = require("../../Model/messages.js");
const constantsFile = require("../../Storage/constants.js");

async function staffCheck(client) {
  const members = await messageModel.find().where("messages").lt(159);
  const guild = await client.guilds.fetch(constantsFile.staffServerID);
  const highStaffChannel = guild.channels.cache.get(constantsFile.highStaffChannel);
  let messageContent = "users who have less than 50 messages:\n";

  for (let i = 0; i < members.length; i++) {
    try {
      const fetchedUser = await guild.members.fetch(members[i].memberID);
      if (fetchedUser.roles.cache.has(constantsFile.retiredStaffRole) === false) {
        messageContent += `<@${fetchedUser.id}> - ${members[i].messages} messages\n`;
      }
    } catch {}
  }

  highStaffChannel.send(`${messageContent}\nstaff checks will be happening on fridays.`);
}

module.exports = { staffCheck };
