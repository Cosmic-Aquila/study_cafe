const { SlashCommandBuilder } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder().setName("forceclose").setDescription("Close an academic channel."),
  async execute(interaction) {
    // Check channel first
    if (
      interaction.channel.type == 0 &&
      interaction.channel.parentId == constantsFile.academicCategory &&
      interaction.member.roles.cache.has(constantsFile.mainStaffrole)
    ) {
      const helpChannel = await interaction.client.channels.fetch(constantsFile.getHelpChannel);
      const channelMention = `<#${interaction.channel.id}>`;
      const openMessage = await helpChannel.messages.fetch(constantsFile.openMessage);
      const closedMessage = await helpChannel.messages.fetch(constantsFile.closeMessage);

      if (!closedMessage.content.includes(channelMention)) {
        const updatedOpenMessage = `${closedMessage.content} \n${channelMention}`;
        closedMessage.edit(updatedOpenMessage);
      }

      if (openMessage.content.includes(channelMention)) {
        const updatedClosedMessage = openMessage.content.replace(`\n${channelMention}`, "");
        openMessage.edit(updatedClosedMessage);
      }
      interaction.reply("Done");
    }
  },
};
