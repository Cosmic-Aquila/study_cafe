const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate Code!")
    .addStringOption((option) => option.setName("code").setDescription("The code to evaluate").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (interaction.user.id !== constantsFile.ownerID) {
      interaction.reply("You don't have permission to use this command");
    }
    try {
      const code = interaction.options.getString("code");
      let evaled = await eval(`(async () => {${code}})()`);
      interaction.reply(`\`\`\`js\n${evaled}\n\`\`\``);
    } catch (err) {
      interaction.reply(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
    }
  },
};
