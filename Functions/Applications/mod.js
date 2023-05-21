const applicationModel = require("../../Model/Staff/applications.js");
const constantsFile = require("../../Storage/constants.js");
const { EmbedBuilder } = require("discord.js");
const levelModel = require("../../Model/Levels/exp.js");

async function modApplication(message) {
  const applicationData = await applicationModel.findOne({
    memberID: message.author.id,
  });
  if (!applicationData) {
    const questionArray = [
      "Age? (Can be a range like 13-15 if you are not comfortable sharing)",
      "Timezone?",
      "Tell me about yourself!",
      "How many hours a week can you be on?",
      "Why do you want to be on the moderation team?",
      "Are you staff in any other servers right now? If so list the names and member count. If not, put N/A.",
      "Do you have any staff experience? Please explain in detail. If not, put N/A.",
      "To be a moderator we are currently requiring 50 messages a month. Please note this is subject to change as the server grows. We will never require more than 100 even when we are a large server. Respond with anything to agree to the terms.",
      "If someone was using bot commands in lounge what would you do?",
      "If someone was cussing at other members what would you do?",
      "If another staff member was abusing their power what would you do?",
      "If someone posts potentially triggering/NSFW content what would you do?",
      "If someone was impersonating staff what would you do?",
      "If someone was mini-modding what would you do?",
      "If someone is begging for higher roles or staff what would you do?",
    ];
    const questionData = new applicationModel({
      questions: questionArray,
      answers: [],
      memberID: message.author.id,
      type: "mod",
    });
    questionData.save();
    message.channel.send(questionArray[0]);
  } else if (applicationData && applicationData.answers.length === 0) {
    applicationData.answers.push(message.content);
    applicationData.save();
    message.channel.send(applicationData.questions[1]);
  } else if (applicationData && applicationData.answers.length > 0 && applicationData.answers.length < applicationData.questions.length - 1) {
    applicationData.answers.push(message.content);
    applicationData.save();
    message.channel.send(applicationData.questions[applicationData.answers.length]);
  } else if (applicationData.answers.length == applicationData.questions.length - 1) {
    applicationData.answers.push(message.content);
    applicationData.save();
    message.channel.send("Application done!");
    const guild = await message.client.guilds.fetch(constantsFile.staffServerID);
    const channel = await guild.channels.fetch(constantsFile.applicationLogChannel);
    const levelData = await levelModel.findOne({ memberID: message.author.id });
    const guildMember = await guild.fetch(message.author.id);
    const embed = new EmbedBuilder()
      .setTitle("There's a new moderator application!")
      .addFields(
        { name: "Discord Name:", value: message.author.tag },
        { name: "Discord ID:", value: message.author.id },
        { name: "Join Date:", value: guildMember.joinedAt.toDateString() },
        { name: "Level:", value: levelData ? `${levelData.level}` : "0" }
      );
    i = 0;
    while (i < applicationData.questions.length) {
      embed.addFields({
        name: applicationData.questions[i],
        value: applicationData.answers[i],
      });
      i++;
    }
    const sentMessage = await channel.send({
      content: `<@&${constantsFile.applicationPingRole}>`,
      embeds: [embed],
    });

    await sentMessage.react("👎");
    await sentMessage.react("👍");
  }
}
module.exports = { modApplication };
