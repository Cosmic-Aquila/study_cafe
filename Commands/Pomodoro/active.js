const pomodoroModel = require("../../Model/Pomodoro/pomodoro.js");

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("active").setDescription("Verify you are active in pomodoro."),
  async execute(interaction) {
    const data = await pomodoroModel.findOne({ memberID: interaction.user.id });

    if (!data) {
      return interaction.reply({ content: "You are not in an active pomodoro session", ephemeral: true });
    }
    data.hasVerified = true;
    data.save();
    interaction.reply({ content: "Done!", ephemeral: true });
  },
};
