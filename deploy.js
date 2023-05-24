async function deploy() {
  const fs = require("node:fs");
  const path = require("node:path");
  const { REST } = require("@discordjs/rest");
  const { Routes } = require("discord.js");
  const { clientId, token } = require("./Storage/config.json");
  const constantsFile = require("./Storage/constants");

  const commands = [];
  const commandsPath = path.join(__dirname, "Commands");
  const commandsFolder = fs.readdirSync("./Commands");

  for (const folder of commandsFolder) {
    const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, folder, file);
      const command = require(filePath);
      commands.push(command.data.toJSON());
    }
  }
  const rest = new REST({ version: "10" }).setToken(token);

  // Add all the commands back
  await rest.put(Routes.applicationGuildCommands(clientId, constantsFile.mainServerID), { body: commands });
  await rest.put(Routes.applicationGuildCommands(clientId, constantsFile.staffServerID), { body: commands });
}

module.exports = { deploy };
