const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const autoReply = require("../../Model/replies.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autoreply")
    .setDescription("Add an auto-reply!")
    .addStringOption((option) => option.setName("trigger").setDescription("The trigger").setRequired(true))
    .addStringOption((option) => option.setName("reply").setDescription("The response").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const trigger = interaction.options.getString("trigger");
    const reply = interaction.options.getString("reply");
    autoReply.create({
      reply: reply,
      trigger: trigger,
    });
    interaction.reply({ content: "Response created", ephemeral: true });
  },
};
