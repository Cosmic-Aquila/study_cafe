const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const messageModel = require("../../Model/messages.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("messagecount")
    .setDescription("Check someone's message count.")
    .addUserOption((option) => option.setName("target").setDescription("The user to check")),
  async execute(interaction) {
    const user = interaction.options.getUser("target") ?? interaction.guild.members.cache.get(interaction.user.id).user;
    const data = await messageModel.findOne({
      memberID: user.id,
    });

    if (!data) {
      return interaction.reply("This user does not have any data in our system yet!");
    }

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s msg count!`)
      .setColor("#8ef1ec")
      .addFields({ name: "messages:", value: `${data.messages}` });

    interaction.reply({
      embeds: [embed],
    });
  },
};
