const { AttachmentBuilder } = require("discord.js");
const { build } = require("./build.js");
const backgroundModel = require("../../../Model/Levels/backgrounds.js");

async function card(levelData, user, message) {
  try {
    const backgroundData = await backgroundModel.findOne({ memberID: "admin" });
    const image = await build(user, backgroundData, levelData);
    const attachment = new AttachmentBuilder(image, { name: "levelup.png" });
    message.channel.send({ content: `${user.username} has leveled up`, files: [attachment] });
  } catch (err) {
    console.error(err);
    message.reply("Error retrieving lb data.");
  }
}

module.exports = { card };
