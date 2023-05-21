const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const expModel = require("../../Model/Levels/exp.js");
const constantsFile = require("../../Storage/constants.js");
const backgroundModel = require("../../Model/Levels/backgrounds.js");
const { build } = require("../../Functions/Levels/RankCards/build.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("See someone's level card.")
    .addUserOption((option) => option.setName("target").setDescription("The user to check")),

  async execute(interaction) {
    const providedUser = interaction.options.getUser("target");
    const userID = providedUser ? providedUser.id : interaction.user.id;
    const member = await interaction.guild.members.fetch(userID);

    const data = await expModel.findOne({
      memberID: userID,
      guildID: constantsFile.mainServerID,
    });

    if (!data) {
      return interaction.reply("No data for this user was found!");
    }

    let backgroundData = await backgroundModel.findOne({ memberID: userID });

    if (!backgroundData) {
      backgroundData = await backgroundModel.findOne({ memberID: "admin" });
    }
    const image = await build(member.user, backgroundData, data);
    const attachment = new AttachmentBuilder(image, { name: "rank.png" });
    interaction.reply({ files: [attachment] });
  },
};
