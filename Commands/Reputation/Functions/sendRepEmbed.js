const { EmbedBuilder } = require("discord.js");
function sendRepEmbed(interaction, member, repAmount) {
  const embed = new EmbedBuilder()
    .setTitle(`${member.tag} has gained 1 rep point!`)
    .setColor("#eec1ad")
    .addFields(
      {
        name: "Current Rep Amount:",
        value: `${repAmount}`,
      },
      {
        name: "Rep Added By:",
        value: interaction.user.username,
      }
    );
  interaction.reply({
    embeds: [embed],
  });
}
module.exports = { sendRepEmbed };
