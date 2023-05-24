const { SlashCommandBuilder } = require("discord.js");
const expModel = require("../../Model/Levels/exp.js");
const { checkLevel } = require("../../Functions/Levels/checkLevel.js");

module.exports = {
  data: new SlashCommandBuilder().setName("levelupdate").setDescription("Update everyone's levels."),
  async execute(interaction) {
    try {
      const members = await interaction.guild.members.fetch();

      members.forEach(async (member) => {
        console.log(member);
        const data = await expModel.find({ memberID: member.id });
        checkLevel(data.level, interaction.guild, member);
      });

      interaction.reply({ content: "Done", ephemeral: true });
    } catch (error) {
      console.error("Error fetching guild members:", error);
    }
  },
};
