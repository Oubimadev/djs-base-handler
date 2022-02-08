// Normal Command Template
const Command = require("../../Structures/Command");
const {} = require("discord.js")

module.exports = new Command({
  name: "",
  description: "",
  aliases: [],
  category: "",
  botPermissions: [],
  userPermissions: [],
  devOnly: false,
  guildOnly: false,
  inDevelopment: true,
  usage: "",
  run: async ({}) => {},
});

// Slash Command Template
const SlashCommand = require("../../Structures/slashCommand");
const {} = require("discord.js")

module.exports = new SlashCommand({
  name: "",
  description: "",
  botPermissions: [],
  userPermissions: [],
  options: [{}],
  type: "CHAT_INPUT",
  run: async ({}) => {},
});


// Context Menu Command Template
const ContextCommand = require("../../Structures/slashContextCommand");
const {} = require("discord.js")

module.exports = new ContextCommand({
  name: "",
  type: "",
  run: async ({}) => {},
});