const fs = require("fs");
const path = require("path");

function loadEvents(client) {
  const eventsPath = path.join(__dirname, "../../Events");
  const folders = fs.readdirSync(eventsPath);

  for (const folder of folders) {
    const files = fs.readdirSync(path.join(eventsPath, folder)).filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const event = require(path.join(eventsPath, folder, file));
      const eventName = event.name;
      const eventCallback = (...args) => event.execute(...args);

      if (event.once) {
        client.once(eventName, eventCallback);
      } else {
        client.on(eventName, eventCallback);
      }
    }
  }
}

module.exports = { loadEvents };
