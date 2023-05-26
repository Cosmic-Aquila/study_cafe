async function autoresponse(message) {
  // Import required modules and files
  const constantsFile = require("../../Storage/constants.js");
  const respondModel = require("../../Model/replies");

  // Check user permissions and channel conditions
  const permissions = message.channel.permissionsFor(message.client.user);
  const isAcademicChannel = message.channel.parentId !== constantsFile.academicCategory;
  const isStaffServer = message.guild.id !== constantsFile.staffServerID;

  if (permissions.has("AttachFiles") && permissions.has("SendMessages") && permissions.has("EmbedLinks") && isAcademicChannel && isStaffServer) {
    // Retrieve all responses
    const responses = await respondModel.find({});

    // Store responses in an array
    const responseArray = responses.map((response) => response);

    let isTriggered = false;

    // Check if message content includes a trigger and send the response
    for (const item of responseArray) {
      if (message.content.includes(item.trigger.toLowerCase()) && !isTriggered) {
        message.reply(item.reply);
        isTriggered = true;
        break;
      }
    }
  }
}

module.exports = { autoresponse };
