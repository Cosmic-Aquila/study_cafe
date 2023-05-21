const { client } = require("../../index.js");
const constantsFile = require("../../Storage/constants.js");
module.exports = {
  name: "error",
  once: false,
  async execute(error) {
    console.error(error);

    const user = await client.users.fetch(constantsFile.ownerID);
    user.send(`\`\`\`js\n${error}\n\`\`\``);
  },
};
