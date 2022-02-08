const { Message } = require("discord.js");
const Client = require("./Client");

/**
 * @typedef {{ client: Client, message: Message, args: String[] }} RunOptions
 * @param {RunOptions} param0
 */
async function RunFunction({ client, message, args }) {}

class Command {
  /**
   * @typedef {{ aliases: Array[], name: string, description: string, devOnly: Boolean, category: string, guildOnly: Boolean, usage: string, inDevelopment: Boolean, userPermissions: import("discord.js").PermissionResolvable[], botPermissions: import("discord.js").PermissionResolvable[], run: RunFunction}} CommandOptions
   * @param {CommandOptions} options
   */
  constructor(options) {
    this.name = options.name;
    this.aliases = options.aliases;
    this.description = options.description;
    this.devOnly = options.devOnly;
    this.guildOnly = options.guildOnly;
    this.category = options.category;
    this.inDevelopment = options.inDevelopment
    this.usage = options.usage;
    this.userPermissions = options.userPermissions;
    this.botPermissions = options.botPermissions;
    this.run = options.run;
  }
}

module.exports = Command;
