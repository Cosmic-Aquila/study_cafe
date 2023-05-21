const { SlashCommandBuilder } = require("discord.js");
const helperCooldown = require("../../Model/Cooldowns/helperPing.js");
const constantsFile = require("../../Storage/constants.js");
const roles = [
  { name: "Math", value: "1109688873690349683" },
  { name: "Science", value: "1109688873690349682" },
  { name: "English", value: "1109688873690349681" },
  { name: "History", value: "1109688873690349680" },
  { name: "Spanish", value: "1109688873669361678" },
  { name: "Programming", value: "1109688873669361682" },
  { name: "Technology", value: "1109688873669361681" },
];
function getValueByName(name) {
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === name) {
      return roles[i].value;
    }
  }
  return null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("helper")
    .setDescription("Ping a helper role.")
    .addStringOption((option) =>
      option
        .setName("subject")
        .setDescription("The subject you need help in")
        .setRequired(true)
        .addChoices(
          { name: "Math", value: "Math" },
          { name: "Science", value: "Science" },
          { name: "English", value: "English" },
          { name: "History", value: "History" },
          { name: "Spanish", value: "Spanish" },
          { name: "Programming", value: "Programming" },
          { name: "Technology", value: "Technology" }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    interaction.member.roles.add(constantsFile.noAutoReplyRole);
    const helperRoleName = interaction.options.getString("subject");
    const ping = getValueByName(helperRoleName);

    const usedData = await helperCooldown.findOne({
      guildID: interaction.guild.id,
      memberID: interaction.user.id,
    });

    if (interaction.channel.type !== 0 || interaction.channel.parentId !== constantsFile.academicCategory) {
      return interaction.reply({
        content: `This must be used in an academic text channel! Be sure to read <#${constantsFile.getHelpChannel}>`,
        ephemeral: true,
      });
    }

    if (usedData && !interaction.member.roles.cache.has(constantsFile.noCooldownRole)) {
      const timeSince = Date.now() - usedData.lastUsed;
      if (timeSince < 1800000) {
        return interaction.reply({ content: "This command has a 30 minute cooldown that is not up yet!", ephemeral: true });
      } else {
        usedData.lastUsed = new Date();
        usedData.save();
      }
    } else if (!usedData && !interaction.member.roles.cache.has(constantsFile.noCooldownRole)) {
      helperCooldown.create({
        guildID: interaction.guild.id,
        memberID: interaction.user.id,
        lastUsed: Date.now(),
      });
    }
    await interaction.channel.send(
      `<@${interaction.user.id}> needs help with a question! please send it and someone will be on their way\n<@&${ping}>`
    );
    interaction.reply({ content: "Help Sent", ephemeral: true });
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
  },
};
