const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("colors")
    .setDescription("Send the colors role embed!")
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
    const tomato = "<@&1109688873753247770>";
    const mango = "<@&1109688873732280321>";
    const pineapple = "<@&1109688873753247764>";
    const kale = "<@&1109688873732280322>";
    const berry = "<@&1109688873732280320>";
    const strawberry = "<@&1109688873732280325>";
    const boba = "<@&1109688873690349688>";
    const coffee = "<@&1109688873690349687>";

    const rolesChannel = await interaction.guild.channels.fetch(constantsFile.rolesChannel);

    const roleEmbed = new EmbedBuilder()
      .setColor("#ffffff")
      .setTitle("pings")
      .setDescription(
        `${oneEmoji} ${tomato}\n${twoEmoji} ${mango}\n${threeEmoji} ${pineapple}\n${fourEmoji} ${kale}\n${fiveEmoji} ${berry}\n${sixEmoji} ${strawberry}\n${sevenEmoji} ${boba}\n${eightEmoji} ${coffee}`
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
