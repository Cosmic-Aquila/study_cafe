const fs = require("fs");
const path = require("path");

function loadCommands(client) {
  const commandsPath = path.join(__dirname, "../../Commands");
  const commandsFolders = fs.readdirSync(commandsPath);

  for (const folder of commandsFolders) {
    const commandFiles = fs.readdirSync(path.join(commandsPath, folder)).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(path.join(commandsPath, folder, file));
      client.commands.set(command.data.name, command);
    }
  }
}

module.exports = { loadCommands };
