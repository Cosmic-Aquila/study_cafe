const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { exec } = require("child_process");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("run")
    .setDescription("Run a command!")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads)
    .addStringOption((option) => option.setName("command").setDescription("The command to run").setRequired(true)),
  async execute(interaction) {
    if (interaction.user.id !== "693511698912641105") {
      interaction.reply("Sorry! Only Toast can use this.");
      return;
    }

    const command = interaction.options.getString("command");

    exec(command, (error, stdout, stderr) => {
      if (error) {
        interaction.reply(`An error occurred while running the command: ${error.message}`);
        return;
      }
      if (stderr) {
        interaction.reply(`An error occurred while running the command: ${stderr}`);
        return;
      }
      if (stdout.length > 2000) {
        console.log(`Output too long: ${stdout}`);
        interaction.reply("Output too long to display. See console for details.");
      } else {
        interaction.reply({ content: `Command executed successfully:\n\`\`\`js\n${stdout}\n\`\`\``, split: true, code: "js" });
      }
    });
  },
};
