const { SlashCommandBuilder } = require("discord.js");
const expModel = require("../../Model/Levels/exp.js");
const { checkLevel } = require("../../Functions/Levels/checkLevel.js");

module.exports = {
  data: new SlashCommandBuilder().setName("levelupdate").setDescription("Update everyone's levels."),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const members = await interaction.guild.members.fetch();

      members.forEach(async (member) => {
        const data = await expModel.findOne({ memberID: member.id });
        if (data) {
          checkLevel(data.level, interaction.guild, member);
        }
      });

      interaction.editReply({ content: "Done", ephemeral: true });
    } catch (error) {
      console.error("Error fetching guild members:", error);
    }
  },
};
