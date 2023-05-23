const { removeRoles } = require("../../Functions/Reactions/removeRole.js");

module.exports = {
  name: "messageReactionRemove",
  once: false,
  async execute(messageReaction, user) {
    const member = await messageReaction.message.guild.members.fetch(user.id);
    removeRoles(messageReaction.message.id, messageReaction.emoji.name, member);
  },
};
