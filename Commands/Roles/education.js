const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("education")
    .setDescription("Send the education role embed!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const oneEmoji = await interaction.guild.emojis.fetch("1110398706655703130");
    const twoEmoji = await interaction.guild.emojis.fetch("1110398708891258931");
    const threeEmoji = await interaction.guild.emojis.fetch("1110398709885304863");
    const fourEmoji = await interaction.guild.emojis.fetch("1110398711282016286");
    const fiveEmoji = await interaction.guild.emojis.fetch("1110398713370771456");
    const sixEmoji = await interaction.guild.emojis.fetch("1110398712297029666");
    const sevenEmoji = await interaction.guild.emojis.fetch("1110399249109233675");
    const eightEmoji = await interaction.guild.emojis.fetch("1110398705133162586");
    const nineEmoji = await interaction.guild.emojis.fetch("1110398707888816138");
    const middle = "<@&1109688873589686332>";
    const high = "<@&1109688873551921191>";
    const uni = "<@&1109688873551921189>";
    const graduated = "<@&1109688873551921188>";

    const rolesChannel = await interaction.guild.channels.fetch(constantsFile.rolesChannel);

    const roleEmbed = new EmbedBuilder()
      .setColor("#ffffff")
      .setTitle("education")
      .setDescription(`${oneEmoji} ${middle}\n${twoEmoji} ${high}\n${threeEmoji} ${uni}\n${fourEmoji} ${graduated}`);
    const message = await rolesChannel.send({ embeds: [roleEmbed] });
    message.react(oneEmoji);
    message.react(twoEmoji);
    message.react(threeEmoji);
    message.react(fourEmoji);
  },
};
