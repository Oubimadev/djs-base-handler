const { ContextMenuInteraction } = require("discord.js");
const Client = require("./Client");

/**
 * @typedef {{ client: Client, interaction: ContextMenuInteraction }} RunOptions
 * @param {RunOptions} param0 
 */
async function runFunction({ client, interaction }) {}

class ContextCommand {
  /**
   * @typedef {{name: string, type: "MESSAGE" | "USER", userPermissions: import("discord.js").PermissionResolvable[], botPermissions: import("discord.js").PermissionResolvable[], run: runFunction }} Run
   * @param {Run} option
   */
  constructor(option) {
    this.name = option.name;
    this.type = option.type;
    this.userPermissions = option.userPermissions
    this.botPermissions = option.userPermissions
    this.run = option.run;
  }
}

module.exports = ContextCommand;