const mongoose = require("mongoose");
const config = require("./Storage/config.json");
const repliesModel = require("./Model/replies.js");

async function connect() {
  await mongoose.connect(config.mongoosePath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

connect();

async function find() {
  const data = await repliesModel.find();
  data.forEach(async (document) => {
    const stringArray = document.reply.split(" ");
    const replacedArray = stringArray.map((word) => {
      if (word === "<#1112440023837577228>") {
        return "<#1112444559352418365>";
      } else {
        return word;
      }
    });
    const replacedString = replacedArray.join(" ");
    console.log(replacedString);

    // Update the document with the modified string
    document.reply = replacedString;
    await document.save();
  });
}

find();
