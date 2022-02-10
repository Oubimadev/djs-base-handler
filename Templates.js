// Command
const Command = require("../../Structures/Command");
const {} = require("discord.js")

module.exports = new Command({
  name: "", // Command Name - Required
  description: "", // Command Description - Required
  aliases: [], // Command Aliases - Optional
  category: "", // Command Category - Required
  botPermissions: [], // Command Bot Permissions - Optional
  userPermissions: [], // Command User Permissions
  devOnly: false, // If the command should only be for the developer - Optional
  guildOnly: false, // If the command should only be for a single guild - Optional
  inDevelopment: true, // If the command is still in development - Optional
  usage: "", // Command Usage - Required
  run: async ({}) => {}, // Running the command / Can be in any order - Can be ({ client, message, args }) | ({ client, message }) | ({ client, args }) | ({ message, args }) | ({ message, client }) | ({ message }) | ({ client }) ({ args });
});


// Slash Command
const SlashCommand = require("../../Structures/slashCommand");
const {} = require("discord.js")

module.exports = new SlashCommand({
  name: "", // Command Name - Required
  description: "", // Command Description - Required
  botPermissions: [], // Command Bot Permissions - Optional
  userPermissions: [], // Command User Permissions - Optional
  options: [{}], // Command Options - Required or Optional
  type: "CHAT_INPUT", // Command Type
  run: async ({}) => {}, // Running the command / Can be in any order - Can be ({ client, interaction, args }) | ({ client, interaction }) | ({ client, args }) | ({ interaction, args }) | ({ interaction, client }) | ({ interaction }) | ({ client }) ({ args });
});

// Context Command
const SlashContextCommand = require("../../Structures/ContextCommand");
const {} = require("discord.js")

module.exports = new SlashContextCommand({
  name: "", // Command Name
  type: "", // Command Type
  botPermissions: [], // Command Bot Permissions
  userPermissions: [], // Command Userpermissions
  run: async ({}) => {}, // Running the command - ({ client, interaction })
});