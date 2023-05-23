const { reactionRoles } = require("../../Functions/Reactions/reactionRoles.js");

module.exports = {
  name: "messageReactionAdd",
  once: false,
  async execute(messageReaction, user) {
    const member = await messageReaction.message.guild.members.fetch(user.id);
    reactionRoles(messageReaction.message.id, messageReaction.emoji.name, member);
  },
};
