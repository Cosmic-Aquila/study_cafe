const { ActivityType, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const CronJob = require("cron").CronJob;

const config = require("../../Storage/config.json");
const constantsFile = require("../../Storage/constants.js");

const muteModel = require("../../Model/Moderation/mutes.js");
const bumpModel = require("../../Model/bump.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    // Log to terminal that bot has logged in
    console.log(`Logged in as ${client.user.tag}!`);

    // Fetch reaction messages
    const messages = [
      "1110408033948934246",
      "1110408997984542760",
      "1110409412478238720",
      "1110410509213241384",
      "1110411293015429181",
      "1111028949431111772",
    ];
    const mainGuild = await client.guilds.fetch(constantsFile.mainServerID);
    const rolesChannel = await mainGuild.channels.fetch("1109688874634067971");
    const tutorRolesChannel = await mainGuild.channels.fetch("1111580805312041000");
    await tutorRolesChannel.messages.fetch("1111583792373715004");
    for (const message of messages) {
      try {
        await rolesChannel.messages.fetch(message);
      } catch {
        console.log(`Could not fetch ${message}`);
      }
    }

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

        const bumpData = await bumpModel.findOne({});
        if (!bumpData) {
          return;
        }
        const guild = await client.guilds.fetch(constantsFile.mainServerID);
        const lastBumped = bumpData.lastBumped;
        const currentTime = new Date();
        const timeDiffInMs = currentTime - lastBumped;
        const timeDiffInHours = timeDiffInMs / (1000 * 60 * 60); // Convert milliseconds to hours
        if (timeDiffInHours >= 2 && bumpData.hasPinged === false) {
          const channel = await client.channels.fetch("1110993048919343205");
          const embed = new EmbedBuilder()
            .setDescription("Time to bump the server!")
            .setColor("#8ef1ec")
            .setDescription("Bump the server using `/bump`")
            .setAuthor({
              name: "After Hours Bump Reminder",
              iconURL: guild.iconURL({ extension: "png" }),
            });
          channel.send({ content: `<@&${constantsFile.bumpPings}>`, embeds: [embed] });
          bumpData.hasPinged = true;
          bumpData.save();
        }
      } catch (err) {
        console.error(err);
      }
    };

    setInterval(minuteChecks, 60000);
  },
};
