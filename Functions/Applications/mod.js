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
      "Have you ever been a moderator in any other Discord server? If yes, please provide details.",
      "Why do you want to become a moderator for our server?",
      "What qualities or skills do you possess that make you suitable for a moderation role?",
      "How familiar are you with our server's rules and guidelines?",
      "How would you handle a situation where two members are engaged in a heated argument?",
      "What would you do if you witnessed someone breaking the server rules?",
      "How would you approach a member who consistently disrupts the server's conversations?",
      "Have you ever encountered a conflict of interest between your personal relationships with server members and your responsibilities as a moderator? If so, how did you handle it?",
      "How active are you on Discord, and how much time can you dedicate to moderating our server?",
      "Do you have any experience with moderation bots or tools? If yes, please provide details.",
      "Are you comfortable enforcing rules and issuing appropriate warnings or penalties when necessary?",
      "How would you contribute to maintaining a positive and inclusive environment within our server?",
      "Have you ever faced criticism or pushback from others regarding your moderation decisions? How did you handle it?",
      "Do you have any additional skills or experience that you believe would benefit our server's moderation team?",
      "How would you handle confidential or sensitive information if it were to come to your attention as a moderator?",
      "Is there anything else you would like to add to support your application?",
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
    message.channel.send(
      "Thank you for taking the time to complete this moderator application. We appreciate your interest in joining our moderation team. We will carefully review your responses and contact you if we find that you are a good fit for the role. Good luck!"
    );
    const guild = await message.client.guilds.fetch(constantsFile.staffServerID);
    const channel = await guild.channels.fetch(constantsFile.applicationLogChannel);
    const levelData = await levelModel.findOne({ memberID: message.author.id });
    const guildMember = await guild.fetch(message.author.id);
    const embed = new EmbedBuilder()
      .setTitle("There's a new moderator application!")
      .addFields(
        { name: "Discord Name:", value: message.author.tag },
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
      content: `<@&${constantsFile.applicationPingRole}>\nID: ${message.author.id}`,
      embeds: [embed],
    });

    await sentMessage.react("👎");
    await sentMessage.react("👍");
  }
}
module.exports = { modApplication };
