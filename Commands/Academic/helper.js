const { SlashCommandBuilder } = require("discord.js");
const helperCooldown = require("../../Model/Cooldowns/helperPing.js");
const constantsFile = require("../../Storage/constants.js");
const roles = [
  { name: "math", value: "1109688873690349683" },
  { name: "science", value: "1109688873690349682" },
  { name: "english", value: "1109688873690349681" },
  { name: "history", value: "1109688873690349680" },
  { name: "spanish", value: "1109688873669361678" },
  { name: "code/tech", value: "1109688873669361682" },
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
          { name: "math", value: "math" },
          { name: "science", value: "science" },
          { name: "english", value: "english" },
          { name: "history", value: "history" },
          { name: "spanish", value: "spanish" },
          { name: "code/tech", value: "code/tech" }
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
