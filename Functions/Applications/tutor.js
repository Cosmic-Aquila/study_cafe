const applicationModel = require("../../Model/Staff/applications.js");
const constantsFile = require("../../Storage/constants.js");
const { EmbedBuilder } = require("discord.js");
const levelModel = require("../../Model/Levels/exp.js");

async function tutorApplication(message) {
  const applicationData = await applicationModel.findOne({
    memberID: message.author.id,
  });
  if (!applicationData) {
    const questionArray = [
      "Age? (Can be a range like 13-15 if you are not comfortable sharing)",
      "Timezone?",
      "What is your current grade?",
      "Tell us about yourself!",
      "How many hours a week can you be on?",
      "Why do you want to join the study cafe tutor team?",
      "Are you a member of staff or a tutor in any other servers right now? If so list the names and member count. If not, put N/A.",
      "Do you have any tutor experience? Please explain in detail. If not, put N/A.",
      "In one message, Please list the your chosen tutor topics. E.G. Maths, English, Science, ETC.",
      "For the topics you chose; please list, in one message, the modules you know the most about. E.G. Maths - Calc & Trig OR Science - Physics",
    ];

    // change type to tutor
    const questionData = new applicationModel({
      questions: questionArray,
      answers: [],
      memberID: message.author.id,
      type: "tutor",
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
      // Change title
      .setTitle("There's a new tutor application!")
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
// Change export name to tutorApplication
module.exports = { tutorApplication };
