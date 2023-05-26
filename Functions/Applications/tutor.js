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
      "What is your current grade level?",
      "Have you ever been a Homework Helper or tutor in any other capacity? If yes, please provide details.",
      "What subjects or areas are you most knowledgeable in and comfortable assisting with?",
      "What motivates you to help others with their homework and academic challenges?",
      "Are you a member of staff or a tutor in any other servers right now? If so list the names and member count. If not, put N/A.",
      "How familiar are you with our server's guidelines and rules?",
      "How would you handle a situation where a student asks for answers instead of seeking guidance or understanding?",
      "Describe your approach to helping students who are struggling with a difficult concept or topic.",
      "Have you ever encountered a student who consistently relies on others to complete their assignments without making an effort to learn? If so, how did you handle it?",
      "How would you handle a situation where a student becomes disrespectful or rude towards you or another member of the server?",
      "Are you able to explain complex ideas or concepts in a clear and understandable manner?",
      "How active are you on Discord, and how much time can you dedicate to helping students on our server?",
      "Are you open to receiving feedback from others and improving your own tutoring skills?",
      "Do you have any additional skills or experience that you believe would benefit our team?",
      "How would you handle sensitive or confidential information that a student might share with you?",
      "Is there anything else you would like to add to support your application?",
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
    message.channel.send(
      "Thank you for taking the time to complete this tutor application. We appreciate your interest in joining our team. We will carefully review your responses and contact you if we find that you are a good fit for the role. Best of luck!"
    );
    const guild = await message.client.guilds.fetch(constantsFile.staffServerID);
    const channel = await guild.channels.fetch(constantsFile.applicationLogChannel);
    const levelData = await levelModel.findOne({ memberID: message.author.id });
    const guildMember = await guild.fetch(message.author.id);
    const embed = new EmbedBuilder()
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
