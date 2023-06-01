const { ActivityType, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const moment = require("moment");
const CronJob = require("cron").CronJob;

const config = require("../../Storage/config.json");
const constantsFile = require("../../Storage/constants.js");

const muteModel = require("../../Model/Moderation/mutes.js");
const bumpModel = require("../../Model/bump.js");
const pomodoroModel = require("../../Model/Pomodoro/pomodoro.js");
const minutesModel = require("../../Model/Pomodoro/minutes.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    // Log to terminal that bot has logged in
    console.log(`Logged in as ${client.user.tag}!`);

    // Fetch reaction messages
    const messages = [
      "1112966931868307527",
      "1112966015903596545",
      "1112969138831368292",
      "1112972458157408326",
      "1112971510777397268",
      "1112973999325052978",
    ];
    const mainGuild = await client.guilds.fetch(constantsFile.mainServerID);
    const rolesChannel = await mainGuild.channels.fetch(constantsFile.rolesChannel);
    const tutorRolesChannel = await mainGuild.channels.fetch(constantsFile.tutorRolesChannel);
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

    const intervalChecks = async function () {
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
          const channel = await client.channels.fetch(constantsFile.cmdChannel);
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

        const pomodoroDatas = await pomodoroModel.find({});
        for (const pomodoroData of pomodoroDatas) {
          const givenDate = pomodoroData.joinedAt;
          const timeNow = new Date();
          const timeSince = (timeNow - givenDate) / (1000 * 60);

          const member = await mainGuild.members.fetch(pomodoroData.memberID);

          if (!member.voice.channel) {
            await pomodoroModel.findOneAndDelete({ memberID: pomodoroData.memberID });
            const voiceData = await pomodoroModel.findOne({ work: pomodoroData.work, break: pomodoroData.break });
            if (!voiceData) {
              await mainGuild.channels.delete(pomodoroData.voiceChannelID);
              await mainGuild.channels.delete(pomodoroData.breakChannelID);
            }
            return;
          }

          if (pomodoroData.type === "work" && givenDate < timeNow && timeSince > pomodoroData.work) {
            const channel = await mainGuild.channels.fetch(pomodoroData.breakChannelID);

            member.voice.setChannel(channel);
            pomodoroData.type = "break";
            pomodoroData.hasVerfied = false;
            pomodoroData.joinedAt = new Date();
            pomodoroData.save();
            const oldDateObj = moment();
            const newDateObj = moment(oldDateObj).add(pomodoroData.break, "m").toDate();
            const unixTimestamp = Math.floor(newDateObj.getTime() / 1000);

            channel.send(
              `${member.user.username} your next study is in <t:${unixTimestamp}:R>. Be sure to run the /active cmd so we know you aren't afk!`
            );
          } else if (pomodoroData.type === "break" && givenDate < timeNow && timeSince > pomodoroData.work) {
            if (!pomodoroData.hasVerfied) {
              return await member.voice.disconnect();
            }
            const channel = await mainGuild.channels.fetch(pomodoroData.voiceChannelID);

            member.voice.setChannel(channel);
            pomodoroData.type = "work";
            pomodoroData.joinedAt = new Date();
            pomodoroData.save();
            const oldDateObj = moment();
            const newDateObj = moment(oldDateObj).add(pomodoroData.work, "m").toDate();
            const unixTimestamp = Math.floor(newDateObj.getTime() / 1000);

            channel.send(`${member.user.username} your next break is in <t:${unixTimestamp}:R>`);
          } else if (pomodoroData.type === "work") {
            const minutesData = await minutesModel.findOne({ memberID: pomodoroData.memberID });
            if (minutesData) {
              minutesData.points += 0.2;
              minutesData.save();
            } else {
              minutesModel.create({
                memberID: pomodoroData.memberID,
                points: 0.2,
              });
            }
          } else if (pomodoroData.type === "break" && !pomodoroData.hasVerfied) {
            const reminderInterval = pomodoroData.break / 60000 / 5;
            console.log(reminderInterval);
            console.log(timeSince);
            if (timeSince >= reminderInterval && pomodoroData.hasReminded === false) {
              const channel = await mainGuild.channels.fetch(constantsFile.cmdChannel);
              channel.send(`<@${pomodoroData.memberID}> run the /active cmd so we know you are still active in your pomodoro session!`);
              pomodoroData.hasReminded = true;
              pomodoroData.save();
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    setInterval(intervalChecks, 30000);
  },
};
