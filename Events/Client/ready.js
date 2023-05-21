const { ActivityType } = require("discord.js");
const mongoose = require("mongoose");
const CronJob = require("cron").CronJob;

const config = require("../../Storage/config.json");
const constantsFile = require("../../Storage/constants.js");

const muteModel = require("../../Model/Moderation/mutes.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    // Log to terminal that bot has logged in
    console.log(`Logged in as ${client.user.tag}!`);

    // Get channel and send a message saying the bot has started
    const timeStarted = Math.floor(new Date().getTime() / 1000);
    client.channels
      .fetch(constantsFile.statusChannel)
      .then((channel) => {
        channel.send(`Bot Started at <t:${timeStarted}>`);
      })
      .catch((error) => {
        console.error(error);
      });

    // Set the bot's status
    client.user.setPresence({
      activities: [{ name: `☕ Serving Coffee!`, type: ActivityType.Playing }],
      status: "online",
    });

    mongoose.set("strictQuery", true);

    // Connect to mongoose
    await mongoose.connect(config.mongoosePath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // First day of the month at 5 PM (Clear Day)
    const startOfMonthJob = new CronJob(
      "0 0 17 1 * *",
      function () {
        Promise.all([allMessages(client), staffCheck(client), messageLB(startOfMonthJob, client)])
          .then(() => {
            setstaffzero(client);
          })
          .catch((error) => {
            console.error(error);
          });
      },
      null,
      true,
      "America/New_York"
    );

    const minuteChecks = async function () {
      try {
        // Check Mutes
        const muteDatas = await muteModel.find({});
        const mainGuild = await client.guilds.fetch(constantsFile.mainServerID);
        const muteRole = await mainGuild.roles.fetch(constantsFile.muteRole);

        for (const muteData of muteDatas) {
          const givenDate = new Date(muteData.startedAt);
          const timeNow = new Date();
          const timeSince = timeNow - givenDate;

          if (muteData.startedAt < timeNow && timeSince > ms(muteData.duration)) {
            const member = await mainGuild.members.fetch(muteData.memberID);
            await member.roles.remove(muteRole);
            await muteModel.findOneAndDelete({ memberID: muteData.memberID });
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    setInterval(minuteChecks, 60000);
  },
};
