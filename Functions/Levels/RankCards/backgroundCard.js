const { AttachmentBuilder } = require("discord.js");
const { build } = require("./build.js");

async function backgroundCard(levelData, backgroundData, user, message) {
  try {
    const image = await build(user, backgroundData, levelData);
    const attachment = new AttachmentBuilder(image, { name: "levelup.png" });
    message.channel.send({ content: `${user.username} has leveled up`, files: [attachment] });
  } catch (err) {
    console.error(err);
  }
}
module.exports = { backgroundCard };
