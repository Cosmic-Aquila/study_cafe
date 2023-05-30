const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pronouns")
    .setDescription("Send the pronouns role embed!")
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
    const she_her = "<@&1109688873635811410>";
    const he_him = "<@&1109688873635811409>";
    const they_them = "<@&1109688873635811408>";
    const any = "<@&1109688873589686341>";
    const ask = "<@&1109688873589686340>";
    const rolesChannel = await interaction.guild.channels.fetch(constantsFile.rolesChannel);

    const roleEmbed = new EmbedBuilder()
      .setColor("#ffffff")
      .setTitle("pronouns")
      .setDescription(`${oneEmoji} ${she_her}\n${twoEmoji} ${he_him}\n${threeEmoji} ${they_them}\n${fourEmoji} ${any}\n${fiveEmoji} ${ask}`);
    const message = await rolesChannel.send({ embeds: [roleEmbed] });
    message.react(oneEmoji);
    message.react(twoEmoji);
    message.react(threeEmoji);
    message.react(fourEmoji);
    message.react(fiveEmoji);
  },
};
