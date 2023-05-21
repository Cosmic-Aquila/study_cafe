const { SlashCommandBuilder } = require("discord.js");
const rep = require("../../Model/repBalance.js");
const repCooldown = require("../../Model/Cooldowns/repCooldown");
const { sendRepEmbed } = require("./Functions/sendRepEmbed.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rep")
    .setDescription("Rep a user.")
    .addUserOption((option) => option.setName("target").setDescription("The user to rep").setRequired(true)),

  async execute(interaction) {
    const member = interaction.options.getUser("target");
    const isModerator = interaction.member.roles.cache.has("1040834838690795560");

    let data = await rep.findOne({ memberID: member.id });
    let usedData = await repCooldown.findOne({ guildID: interaction.guild.id, memberID: interaction.user.id });

    if (member.id === interaction.user.id) {
      return interaction.reply("You can't rep yourself");
    }

    if (!isModerator && usedData && Date.now() - usedData.lastUsed < 2700000) {
      return interaction.reply("The cooldown for this command is not up yet");
    }

    if (!data) {
      data = await rep.create({ memberID: member.id, repAmount: 0 });
    }

    data.repAmount++;
    await data.save();

    if (!usedData) {
      await repCooldown.create({ guildID: interaction.guild.id, memberID: interaction.user.id, lastUsed: Date.now() });
    } else {
      usedData.lastUsed = new Date();
      await usedData.save();
    }

    sendRepEmbed(interaction, member, data.repAmount);
  },
};
