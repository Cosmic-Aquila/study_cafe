const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pings")
    .setDescription("Send the pings role embed!")
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
    const learning = "<@&1109688873530953756>";
    const journaling = "<@&1109688873530953755>";
    const announce = "<@&1109688873530953758>";
    const bump = "<@&1109688873530953757>";
    const revival = "<@&1109688873530953751>";
    const giveaway = "<@&1109688873530953749>";
    const suggestion = "<@&1109688873497411593>";
    const welcomer = "<@&1109688873497411592>";

    const rolesChannel = await interaction.guild.channels.fetch(constantsFile.rolesChannel);

    const roleEmbed = new EmbedBuilder()
      .setColor("#ffffff")
      .setTitle("pings")
      .setDescription(
        `${oneEmoji} ${learning}\n${twoEmoji} ${journaling}\n${threeEmoji} ${announce}\n${fourEmoji} ${bump}\n${fiveEmoji} ${revival}\n${sixEmoji} ${giveaway}\n${sevenEmoji} ${suggestion}\n${eightEmoji} ${welcomer}`
      );
    const message = await rolesChannel.send({ embeds: [roleEmbed] });
    message.react(oneEmoji);
    message.react(twoEmoji);
    message.react(threeEmoji);
    message.react(fourEmoji);
    message.react(fiveEmoji);
    message.react(sixEmoji);
    message.react(sevenEmoji);
    message.react(eightEmoji);
  },
};
