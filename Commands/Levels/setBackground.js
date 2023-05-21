const { SlashCommandBuilder } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");
const backgroundModel = require("../../Model/Levels/backgrounds.js");

const regex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setbackground")
    .setDescription("Set your background for the level card.")
    .addStringOption((option) => option.setName("link").setDescription("The link to the background you want to use"))
    .addStringOption((option) => option.setName("color").setDescription("The hex color for your text")),

  async execute(interaction) {
    const mainGuild = await interaction.client.guilds.fetch(constantsFile.mainServerID);
    const member = await mainGuild.members.fetch(interaction.user.id);

    // Check if user is a booster or staff member
    if (!member.roles.cache.has(constantsFile.mainStaffrole) && !member.roles.cache.has(constantsFile.boosterRole)) {
      return interaction.reply("This can only be used by staff members or boosters");
    }

    const data = await backgroundModel.findOne({ memberID: interaction.user.id });
    const defaultData = await backgroundModel.findOne({ memberID: "admin" });

    if (!data) {
      // Create a new background entry
      const backgroundURL = interaction.options.getString("link");
      const textColor = interaction.options.getString("color");

      if (!backgroundURL && !textColor) {
        return interaction.reply("Please provide at least one parameter to change!");
      }

      if (backgroundURL && !(backgroundURL.includes(".png") || backgroundURL.includes(".jpg") || backgroundURL.includes(".jpeg"))) {
        return interaction.reply("Make sure your link ends in .png .jpg or .jpeg");
      }

      if (textColor && !regex.test(textColor)) {
        return interaction.reply("Invalid hex color! Please use https://htmlcolorcodes.com/color-picker/ and use the one with the # beside it!");
      }

      await backgroundModel.create({
        memberID: interaction.user.id,
        background: backgroundURL || defaultData.background,
        color: textColor || "#FFF",
      });

      return interaction.reply("Done!");
    }

    // Update an existing background entry
    const backgroundURL = interaction.options.getString("link") || data.background;
    const textColor = interaction.options.getString("color") || data.color;

    if (!backgroundURL && !textColor) {
      return interaction.reply("Please provide at least one parameter to change!");
    }

    if (backgroundURL && !(backgroundURL.includes(".png") || backgroundURL.includes(".jpg") || backgroundURL.includes(".jpeg"))) {
      return interaction.reply("Make sure your link ends in .png .jpg or .jpeg");
    }

    if (textColor && !regex.test(textColor)) {
      return interaction.reply("Invalid hex color! Please use https://htmlcolorcodes.com/color-picker/ and use the one with the # beside it!");
    }

    data.background = backgroundURL;
    data.color = textColor;
    await data.save();

    return interaction.reply("Done!");
  },
};
