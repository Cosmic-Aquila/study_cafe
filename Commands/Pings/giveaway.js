const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const pingCooldown = require("../../Model/Cooldowns/giveaway.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Pings the giveaway ping role.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),
  async execute(interaction) {
    let usedData = await pingCooldown.findOne({
      guildID: interaction.guild.id,
    });

    const success = `<@&${constantsFile.giveawayPingRole}>`;
    const regularCooldown = 1200000;

    if (usedData) {
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
      await interaction.channel.send(success);
      interaction.reply({ content: "Ping Sent", ephemeral: true });
      pingCooldown.create({ guildID: interaction.guild.id, lastUsed: Date.now() });
    } else {
      interaction.reply(`<@${constantsFile.ownerID}> broke something in this command. Please wait for them to fix it.`);
    }
  },
};
