const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const constants = require("../../Storage/constants");

module.exports = {
  data: new SlashCommandBuilder().setName("end").setDescription("Send this after you finish helping someone!"),
  async execute(interaction) {
    await interaction.deferReply();

    const embed = new EmbedBuilder()
      .setFooter({
        text: `requested by ${interaction.user.username}`,
        value: interaction.user.displayAvatarURL({
          extension: "png",
        }),
      })
      .setColor("#8ef1ec")
      .setTimestamp()
      .setTitle("done recieving help?")
      .setAuthor({
        name: `${interaction.user.username} - (${interaction.user.id})`,
        iconURL: interaction.guild.iconURL({ format: "png" }),
      })
      .addFields(
        {
          name: "if you found your helper helpful, consider using /rep <user> to give them feedback.",
          value: "if you didn't find your helper helpful, we apologize for the inconvenience. If needed, please let the owner know!",
        },
        {
          name: "for the next person who needs help:",
          value: "yo request assistance, please use /helper and select the subject you need from the menu.",
        }
      );
    interaction.editReply({
      content: "``` ```",
      embeds: [embed],
    });

    const helpChannel = await interaction.client.channels.fetch(constants.getHelpChannel);
    const channelMention = `<#${interaction.channel.id}>`;
    const openMessage = await helpChannel.messages.fetch(constants.openMessage);
    const closedMessage = await helpChannel.messages.fetch(constants.closeMessage);

    if (!openMessage.content.includes(channelMention)) {
      const updatedOpenMessage = openMessage.content + `\n${channelMention}`;
      openMessage.edit(updatedOpenMessage);
    }

    if (closedMessage.content.includes(channelMention)) {
      const updatedClosedMessage = closedMessage.content.replace(`\n${channelMention}`, "");
      closedMessage.edit(updatedClosedMessage);
    }
  },
};
