const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const constants = require("../../Storage/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("editchannels")
    .setDescription("Edit the open/close message")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("state")
        .setDescription("Open or close message")
        .addChoices({ name: "Open", value: "open" }, { name: "Close", value: "close" })
        .setRequired(true)
    )
    .addStringOption((option) => option.setName("part").setDescription("The part to remove from the message").setRequired(true)),
  async execute(interaction) {
    const { options } = interaction;
    const state = options.getString("state");
    const partToRemove = options.getString("part");
    const messageId = state === "open" ? constants.openMessage : constants.closeMessage;

    try {
      const channel = interaction.client.channels.cache.get(constants.getHelpChannel);
      const message = await channel.messages.fetch(messageId);

      if (message.content.includes(partToRemove)) {
        const editedMessage = message.content.replace(partToRemove, "");
        await message.edit(editedMessage);
        return interaction.reply(`Successfully removed ${partToRemove} from the message!`);
      } else {
        return interaction.reply(`The message does not contain ${partToRemove}.`);
      }
    } catch (error) {
      console.error(error);
      return interaction.reply("An error occurred while trying to edit the message.");
    }
  },
};
