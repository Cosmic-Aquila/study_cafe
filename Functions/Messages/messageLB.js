const messageModel = require("../../Model/messages.js");
const { EmbedBuilder } = require("discord.js");
const constantsFile = require("../../Storage/constants.js");

async function messageLB(job, client) {
  console.log("Message LB function running");
  const mainGuild = client.guilds.cache.get(constantsFile.mainServerID);
  const eventChannel = mainGuild.channels.cache.get(constantsFile.mainLBChannel);

  const next = job.nextDates(1);
  const month = next[0].month - 1;
  const date = new Date(next[0].year, month, next[0].day, next[0].hour, next[0].minute, next[0].second);
  const unixTimestamp = Math.floor(date.getTime() / 1000);

  messageModel
    .find({})
    .sort([["messages", "descending"]])
    .limit(2)
    .then(async (res) => {
      console.log(res);
      if (res[0].memberID != constantsFile.ownerID) {
        const eventChannel = mainGuild.channels.cache.get(constantsFile.mainLBChannel);
        const topUser = await (await mainGuild.members.fetch(res[0].memberID)).user;

        const embed = new EmbedBuilder()
          .setTitle("weekly top messenger!")
          .setColor("#8ef1ec")
          .setAuthor({ name: "study cafe", iconURL: mainGuild.iconURL({ extension: "png" }) })
          .addFields(
            {
              name: "User:",
              value: topUser.username,
            },
            { name: "Messages:", value: `${res[0].messages}` }
          );
        eventChannel.send({
          content: `next lb update <t:${unixTimestamp}:R>\n\ncongratulations <@${topUser.id}>! msg <@693511698912641105> to claim role!`,
          embeds: [embed],
        });
      } else {
        const topUser = await (await mainGuild.members.fetch(res[1].memberID)).user;

        const embed = new EmbedBuilder()
          .setTitle("weekly top messenger!")
          .setColor("#8ef1ec")
          .setAuthor({ name: "study cafe", iconURL: mainGuild.iconURL({ extension: "png" }) })
          .addFields(
            {
              name: "user:",
              value: topUser.username,
            },
            { name: "messages:", value: `${res[1].messages}` }
          );
        eventChannel.send({
          content: `next lb update <t:${unixTimestamp}:R>\n\ncongratulations <@${topUser.id}>! msg <@693511698912641105> to claim role!`,
          embeds: [embed],
        });
      }
      await messageModel.deleteMany({});
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = { messageLB };
