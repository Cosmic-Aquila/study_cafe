const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const warnModel = require("../../Model/Moderation/warns.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) => option.setName("user").setDescription("The user to warn").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason for warning them").setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const warnReason = interaction.options.getString("reason");
    const guild = await interaction.client.guilds.fetch(constantsFile.mainServerID);
    const member = guild.members.cache.get(user.id);
    const punishmentChannel = await guild.channels.fetch(constantsFile.punishmentChannel);
    let warnAmount = 0;

    const data = await warnModel.findOne({
      memberID: user.id,
    });

    if (data && member.roles.cache.has(constantsFile.mainStaffrole) == false) {
      data.reasons.push(warnReason);
      data.save();
      warnAmount = data.reasons.length;
    } else if (!data && member.roles.cache.has(constantsFile.mainStaffrole) == false) {
      warnModel.create({ memberID: user.id, reasons: [warnReason] });
      warnAmount = 1;
    } else if (member.roles.cache.has(constantsFile.mainStaffrole) == true) {
      interaction.reply("You can't warn a staff member!");
      return;
    }

    const embed = new EmbedBuilder()
      .setColor("#e35c54")
      .setTitle(`${user.tag} has been warned!`)
      .setDescription(`**User:** <@${user.id}>\n**Reason:** ${warnReason}\n**Warns:** ${warnAmount}\n**Moderator:** ${interaction.user.tag}`);

    punishmentChannel.send({ embeds: [embed] });

    try {
      user.send(`You have been warned in **study cafe** for **${warnReason}**!`);
    } catch {
      punishmentChannel.send("I was not able to DM the user!");
    }

    interaction.reply({ content: "User has been warned!", ephemeral: true });
  },
};
