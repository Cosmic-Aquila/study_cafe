const messageModel = require("../../Model/messages.js");
const constantsFile = require("../../Storage/constants.js");

async function setstaffzero(client) {
  const guild = await client.guilds.fetch(constantsFile.staffServerID);
  guild.members.cache.forEach(async (member) => {
    let data = await messageModel.findOne({ memberID: member.id });
    if (!data && member.user.bot == false) {
      messageModel.create({ memberID: member.id, messages: 0 });
    }
  });
}
module.exports = { setstaffzero };
