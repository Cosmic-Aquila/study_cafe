const pomodoroModel = require("../../Model/Pomodoro/pomodoro.js");
const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const moment = require("moment");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pomodoro")
    .setDescription("Start a session.")
    .addNumberOption((option) => option.setName("work").setDescription("The work interval").setRequired(true))
    .addNumberOption((option) => option.setName("break").setDescription("The break interval").setRequired(true))
    .addNumberOption((option) => option.setName("users").setDescription("How many users can join the voice channel").setRequired(true)),
  async execute(interaction) {
    const breakInterval = interaction.options.getNumber("break");
    const workInterval = interaction.options.getNumber("work");
    const userLimit = interaction.options.getNumber("users");

    if (breakInterval <= 0 || breakInterval >= 120 || workInterval <= 0 || workInterval >= 120) {
      return interaction.reply({ content: "Please use numbers from 1-120 for work and break", ephemeral: true });
    }

    if (userLimit <= 0 || userLimit >= 15) {
      return interaction.reply({ content: "Please use numbers from 1-15 for user limits", ephemeral: true });
    }

    const existingPomodoro = await pomodoroModel.findOne({ break: breakInterval, work: workInterval });
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: "You need to be in a voice channel to start a session so I can move you!", ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });
    let channelID;
    let breakChannelID;

    if (existingPomodoro) {
      const channel = await interaction.guild.channels.fetch(existingPomodoro.voiceChannelID);
      console.log(channel.userLimit);
      console.log(channel.members);

      if (channel.members.size >= channel.userLimit) {
        return interaction.editReply({ content: "That pomodoro is currently full!", ephemeral: true });
      }
      interaction.member.voice.setChannel(channel);
      channelID = channel.id;
      breakChannelID = existingPomodoro.breakChannelID;
      const oldDateObj = moment();
      const newDateObj = moment(oldDateObj).add(workInterval, "m").toDate();
      const unixTimestamp = Math.floor(newDateObj.getTime() / 1000);

      channel.send(`${interaction.user.tag} your next break is in <t:${unixTimestamp}:R>`);
    } else {
      const channel = await interaction.guild.channels.create({
        name: `Pomodoro ${workInterval}/${breakInterval}`,
        type: ChannelType.GuildVoice,
        permissionOverwrites: [
          { id: constantsFile.mainModTeam, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect] },
          { id: interaction.guild.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.Connect] },
        ],
        userLimit: userLimit,
      });

      const oldDateObj = moment();
      const newDateObj = moment(oldDateObj).add(workInterval, "m").toDate();
      const unixTimestamp = Math.floor(newDateObj.getTime() / 1000);

      channel.send(`${interaction.user.tag} your next break is in <t:${unixTimestamp}:R>`);

      const breakChannel = await interaction.guild.channels.create({
        name: `Pomodoro Break ${workInterval}/${breakInterval}`,
        type: ChannelType.GuildVoice,
        permissionOverwrites: [
          { id: constantsFile.mainModTeam, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect] },
          { id: interaction.guild.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.Connect] },
        ],
        userLimit: userLimit,
      });
      interaction.member.voice.setChannel(channel);
      channelID = channel.id;
      breakChannelID = breakChannel.id;
    }
    await pomodoroModel.create({
      memberID: interaction.user.id,
      work: workInterval,
      break: breakInterval,
      voiceChannelID: channelID,
      joinedAt: new Date(),
      type: "work",
      hasVerified: false,
      hasReminded: false,
      breakChannelID: breakChannelID,
    });

    interaction.editReply({ content: "Started!", ephemeral: true });
  },
};
