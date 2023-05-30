const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("continent")
    .setDescription("Send the continent role embed!")
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
    const north_america = "<@&1109688873551921187>";
    const south_america = "<@&1109688873551921186>";
    const europe = "<@&1109688873551921185>";
    const asia = "<@&1109688873551921184>";
    const oceania = "<@&1109688873551921183>";
    const australia = "<@&1109688873551921182>";
    const rolesChannel = await interaction.guild.channels.fetch(constantsFile.rolesChannel);

    const roleEmbed = new EmbedBuilder()
      .setColor("#ffffff")
      .setTitle("continent")
      .setDescription(
        `${oneEmoji} ${north_america}\n${twoEmoji} ${south_america}\n${threeEmoji} ${europe}\n${fourEmoji} ${asia}\n${fiveEmoji} ${oceania}\n${sixEmoji}${australia}`
      );
    const message = await rolesChannel.send({ embeds: [roleEmbed] });
    message.react(oneEmoji);
    message.react(twoEmoji);
    message.react(threeEmoji);
    message.react(fourEmoji);
    message.react(fiveEmoji);
    message.react(sixEmoji);
  },
};
