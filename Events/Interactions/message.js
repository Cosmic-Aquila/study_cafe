const { xp } = require("../../Functions/Levels/xp.js");
const { autoresponse } = require("../../Functions/Messages/autoresponse.js");
const { modApplication } = require("../../Functions/Applications/mod.js");
const { tutorApplication } = require("../../Functions/Applications/tutor.js");

const config = require("../../Storage/config.json");
const constantsFile = require("../../Storage/constants.js");

const axios = require("axios");

const messageModel = require("../../Model/messages.js");
const applicationModel = require("../../Model/Staff/applications.js");
const bumpModel = require("../../Model/bump.js");
const countModel = require("../../Model/counting.js");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (
      message.guild &&
      message.guild.id == constantsFile.staffServerID &&
      message.embeds.length > 0 &&
      message.embeds[0].author &&
      message.embeds[0].author.name === "Cosmic-Aquila"
    ) {
      await message.channel.send("Attempting to restart...");
      const url = "https://panel.storinatemc.tech/api/client/servers/0eb4ad17/power?signal=restart";

      axios({
        method: "POST",
        url: url,
        headers: {
          Authorization: "Bearer " + config.apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then(function (response) {
          console.log(`${response.status}: ${response.statusText}`);
        })
        .catch(function (error) {
          console.log(`${error.code}`);
          interaction.reply("An error occured!");
        });
    }

    if (message.author.id === "302050872383242240" && message.embeds.length > 0 && message.embeds[0].description.includes("Bump done!")) {
      const bumpData = await bumpModel.findOne({});
      if (!bumpData) {
        await bumpModel.create({ lastBumped: new Date(), hasPinged: false });
      } else {
        bumpData.lastBumped = new Date();
        bumpData.hasPinged = false;
        bumpData.save();
      }
    }

    if (message.author.bot) return;

    const guild = await message.client.guilds.fetch(constantsFile.mainServerID);
    try {
      var member = await guild.members.fetch(message.author.id);
    } catch {
      console.log("could not fetch member");
    }

    if (message.channel.type === 1 && member.roles.cache.has(constantsFile.levelthreerole)) {
      // DMs
      const applicationData = await applicationModel.findOne({
        memberID: message.author.id,
      });
      if (message.content.toLowerCase().includes("apply") && !applicationData) {
        message.reply("What team would you like to apply for:\nMod\nTutor");
      } else if (message.content.toLowerCase() == "cancel" && applicationData && applicationData.answers.length < applicationData.questions.length) {
        await applicationModel.findOneAndDelete({ memberID: message.author.id });
        message.reply("Application cancelled!");
      } else if (message.content.toLowerCase().includes("mod") || (applicationData && applicationData.type.toLowerCase() === "mod")) {
        modApplication(message);
      } else if (message.content.toLowerCase().includes("tutor") || (applicationData && applicationData.type.toLowerCase() === "tutor")) {
        tutorApplication(message);
      } else {
        return;
      }
    } else if (message.channel.type === 1 && !member.roles.cache.has(constantsFile.levelthreerole)) {
      message.reply("you must be level 3 to apply!");
    }

    if (message.channel.type === 0) {
      if (
        message.member.roles.cache.has(constantsFile.mainStaffrole) == false &&
        message.member.roles.cache.has(constantsFile.noAutoReplyRole) == false
      ) {
        await autoresponse(message);
      }

      if (message.guild.id == constantsFile.mainServerID) {
        xp(message);
      }

      if (message.guild.id == constantsFile.mainServerID || message.guild.id == constantsFile.staffServerID) {
        const data = await messageModel.findOne({
          memberID: message.author.id,
        });
        if (data) {
          data.messages++;
          data.save();
        } else if (!data) {
          messageModel.create({ memberID: message.author.id, messages: 1 });
        }

        if (message.channel.id === constantsFile.countingChannel) {
          const countData = await countModel.findOne({});

          if (countData && message.author.id !== countData.lastCounter && message.content === `${countData.count + 1}`) {
            countData.count++;
            countData.lastCounter = message.author.id;
            countData.save();
            message.react("☕");
          } else if (message.author.id === countData.lastCounter) {
            message.delete();
          } else if (!countData && message.content === "1") {
            countModel.create({ count: 1, lastCounter: message.author.id });
            message.react("☕");
          } else {
            message.delete();
          }
        }
      }
    }
  },
};
