const constantsFile = require("../../Storage/constants.js");

async function checkLevel(level, guild, member) {
  if (level === 1) {
    let role = await guild.roles.fetch(constantsFile.levelonerole);
    member.roles.add(role);
  } else if (level === 2) {
    let role = await guild.roles.fetch(constantsFile.leveltworole);
    member.roles.add(role);
  } else if (level === 3) {
    let role = await guild.roles.fetch(constantsFile.levelthreerole);
    member.roles.add(role);
  } else if (level === 20) {
    let role = await guild.roles.fetch(constantsFile.leveltwentyrole);
    member.roles.add(role);
  } else if (level === 30) {
    let role = await guild.roles.fetch(constantsFile.levelthirtyrole);
    member.roles.add(role);
  } else if (level === 40) {
    let role = await guild.roles.fetch(constantsFile.levelfortyrole);
    member.roles.add(role);
  } else if (level === 50) {
    let role = await guild.roles.fetch(constantsFile.levelfiftyrole);
    member.roles.add(role);
  }
}

module.exports = { checkLevel };
