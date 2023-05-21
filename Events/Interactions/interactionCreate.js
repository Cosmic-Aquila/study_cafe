const messageModel = require("../../Model/messages.js");
const constantsFile = require("../../Storage/constants.js");
const { PermissionFlagsBits, ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      if (interaction.guild.id == constantsFile.mainServerID || interaction.guild.id == constantsFile.staffServerID) {
        const data = await messageModel.findOne({
          memberID: interaction.user.id,
        });
        if (data) {
          data.messages++;
          data.save();
        } else if (!data) {
          messageModel.create({ memberID: interaction.user.id, messages: 1 });
        }
      }

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        console.log(`${interaction.commandName} was run by ${interaction.user.username}`);
        await command.execute(interaction, interaction.client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const existingTicketChannel = interaction.guild.channels.cache.find((channel) => channel.name === `ticket-${interaction.user.id}`);
      if (existingTicketChannel) {
        await interaction.reply({ content: "You already have an active ticket.", ephemeral: true });
        return;
      }
      const ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.id}`,
        type: ChannelType.GuildText,
        parent: "1109639025242931270",
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
          },
          {
            id: constantsFile.ticketPingRole,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
          },
        ],
      });

      const embed = new EmbedBuilder()
        .setTitle("Support Ticket")
        .setColor("Green")
        .setDescription(`User: ${interaction.user.tag}\nID: ${interaction.user.id}\n**Please tell us your reason for opening the ticket**`);
      await ticketChannel.send({ content: `<@&${constantsFile.ticketPingRole}>`, embeds: [embed] });

      await interaction.reply({ content: `Your ticket has been created. Please check ${ticketChannel} for assistance.`, ephemeral: true });
    }
  },
};
