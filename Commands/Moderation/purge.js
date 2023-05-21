const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge some messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) => option.setName("messages").setDescription("The number of messages to clear").setRequired(true)),
  async execute(interaction) {
    const messagesToDelete = interaction.options.getInteger("messages");
    const punishmentChannel = await interaction.guild.channels.fetch(constantsFile.punishmentChannel);

    if (messagesToDelete <= 0 || messagesToDelete > 100) {
      return interaction.reply({ content: "You must specify a number between 1 and 100.", ephemeral: true });
    }

    await interaction.channel.bulkDelete(messagesToDelete);

    const embed = new EmbedBuilder()
      .setColor("#e35c54")
      .setTitle(`Messages deleted in <#${interaction.channel.id}>!`)
      .setDescription(`**Messages Purged:** ${messagesToDelete}\n**Moderator:** ${interaction.user.username}`);

    punishmentChannel.send({ embeds: [embed] });

    return interaction.reply({ content: `Successfully deleted ${messagesToDelete} messages.`, ephemeral: true });
  },
};
