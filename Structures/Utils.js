const client = require("./Client");
const { readdirSync } = require("fs");
const ascii = require("ascii-table");
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const mongoose = require("mongoose");
const { default: chalk } = require("chalk");

class Util {
  /**
   * @param {client} client
   */
  constructor(client) {
    this.client = client;
  }

  async startClient() {
    this.client.login(this.client.config.token);

    let table = new ascii("Command Load Status");
    table.setHeading("Commands", "Load Status");

    readdirSync("./commands/").forEach((dir) => {
      const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
        file.endsWith(".js")
      );
      for (let file of commands) {
        let pull = require(`../commands/${dir}/${file}`);
        if (pull.name) {
          client.commands.set(pull.name, pull);
          table.addRow(file, "✅ Command Loaded");
        } else {
          table.addRow(
            file,
            "❌ -> Missing a command name, or command name is not a string."
          );
          continue;
        }
        if (pull.aliases && Array.isArray(pull.aliases))
          pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
      }
    });

    // Events
    readdirSync("./events/").forEach((file) => {
      const events = readdirSync("./events/").filter((file) =>
        file.endsWith(".js")
      );
  
      for (let file of events) {
        let pull = require(`../events/${file}`);
  
        if (pull.name) {
          client.events.set(pull.name, pull);
        } else {
          continue;
        }
      }
    });

    const slashCommands = await globPromise(
      `${__dirname}/../SlashCommands/**/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
      const file = require(value);
      if (file.name) {
        table.addRow(file.name, "✅ SlashCMD Loaded");
      } else if (!file?.name) {
        table.addRow(
          `${file.name || "Missing"}`,
          "❌ -> Missing a name, or name is not a string."
        );
      }
      this.client.slashCommands.set(file.name, file);

      if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
      arrayOfSlashCommands.push(file);
    });

    this.client.on("ready", async () => {
      await this.client.application.commands
        .set(arrayOfSlashCommands)
        .then(() => {
          console.log("Loaded global commands");
        });
    });
    console.log(table.toString());

    if (!this.client.config.mongooseConnectionString) return;

    mongoose.connect(this.client.config.mongooseConnectionString);
    mongoose.connection.on("connected", () =>
      console.log(chalk.green("Connected to the database."))
    );
    mongoose.connection.on("disconnected", () =>
      console.log(chalk.red("Disconnected from the database."))
    );
    mongoose.connection.on("error", (error) =>
      console.log(
        chalk.red(
          `There was an error connecting to the database.\nError: ${error}`
        )
      )
    );
  }
}
module.exports = Util;
