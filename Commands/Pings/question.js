const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const pingCooldown = require("../../Model/Cooldowns/qotd.js");
const constantsFile = require("../../Storage/constants.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qotd")
    .setDescription("Pings the qotd ping role.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),
  async execute(interaction) {
    let usedData = await pingCooldown.findOne({
      guildID: interaction.guild.id,
    });

    const success = `<@&${constantsFile.questionPingRole}>\nCreate a ticket to answer the QOTD: https://discord.com/channels/1040773239607140485/1040841716086874133/1107045188351836170`;
    const regularCooldown = 1200000;

    if (usedData) {
      let time = usedData.lastUsed;
      let x = Date.now();
      const timeSince = x - time;

      if (timeSince < regularCooldown) {
        interaction.reply("This command has a 20 minute cooldown that is not up yet!");
      } else if (timeSince >= regularCooldown) {
        const ticketButton = new ButtonBuilder().setCustomId("create_ticket").setLabel("Open a ticket!").setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder().addComponents(ticketButton);
        await interaction.channel.send({ content: success, components: [row] });
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
      interaction.reply(`<@${constantsFile.ownerID}> broke something in the command. Please wait for them to fix it.`);
    }
  },
};
