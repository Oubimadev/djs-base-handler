const { CommandInteraction } = require("discord.js");
const Client = require("./Client");

/**
 * @typedef {{ client: Client, interaction: CommandInteraction, args: String[] }} RunOptions
 * @param {RunOptions} param0
 */
async function runFunction({ client, interaction, args }) {}

class SlashCommand {
  /**
   * @typedef {{name: string, description: string, type: "CHAT_INPUT", devOnly: Boolean, options: import("discord.js").ApplicationCommandOptionData[], userPermissions: import("discord.js").PermissionResolvable[], botPermissions: import("discord.js").PermissionResolvable[], run: runFunction }} Run
   * @param {Run} option
   */
  constructor(option) {
    this.name = option.name;
    this.description = option.description;
    this.userPermissions = option.userPermissions;
    this.botPermissions = option.botPermissions;
    this.devOnly = option.devOnly
    this.options = option.options;
    this.type = option.type;
    this.run = option.run;
  }
}

module.exports = SlashCommand;
