const { SlashCommandBuilder } = require("discord.js");
const pingCooldown = require("../../Model/Cooldowns/DCP.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder().setName("deadchat").setDescription("Pings the dead chat ping role."),
  async execute(interaction) {
    if (interaction.channel.id == constantsFile.mainGeneralChat) {
      let usedData = await pingCooldown.findOne({
        guildID: interaction.guild.id,
      });

      const success = `<@&${constantsFile.deadChatRole}>`;
      const regularCooldown = 1200000;

      if (interaction.user.id === constantsFile.ownerID) {
        await interaction.channel.send(success);
        interaction.reply({ content: "Ping Sent", ephemeral: true });
      } else if (usedData) {
        let time = usedData.lastUsed;
        let x = Date.now();
        const timeSince = x - time;

        if (timeSince < regularCooldown) {
          interaction.reply("This command has a 20 minute cooldown that is not up yet!");
        } else if (timeSince >= regularCooldown) {
          await interaction.channel.send(success);
          interaction.reply({ content: "Ping Sent", ephemeral: true });
          usedData.lastUsed = new Date();
          usedData.save();
        } else {
          interaction.reply(`<@${constantsFile.ownerID}> broke something in the cooldown. Please wait for them to fix it.`);
        }
      } else if (!usedData) {
        interaction.channel.send(success);
        let newCooldown = new pingCooldown({
          guildID: interaction.guild.id,
          lastUsed: Date.now(),
        });
        newCooldown.save();
      } else {
        interaction.reply(`<@${constantsFile.ownerID}> broke something in this command. Please wait for them to fix it.`);
      }
    } else {
      interaction.reply(`This can only be used in <#${constantsFile.mainGeneralChat}>`);
    }
  },
};
