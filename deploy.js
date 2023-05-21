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

  // Delete all commands
  rest
    .get(Routes.applicationGuildCommands(clientId, constantsFile.mainServerID))
    .then((data) => {
      const promises = [];
      for (const command of data) {
        const deleteUrl = `${Routes.applicationGuildCommands(clientId, constantsFile.mainServerID)}/${command.id}`;
        promises.push(rest.delete(deleteUrl));
      }
      return Promise.all(promises);
    })
    .catch((error) => {
      console.error(error);
    });

  // Add all the commands back
  rest
    .put(Routes.applicationCommands(clientId), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
}

module.exports = { deploy };
