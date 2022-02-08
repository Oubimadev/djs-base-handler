const client = require("./Client");
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const ascii = require('ascii-table');
const { mongooseConnectionString } = require("./Data/config.json");
const { default: chalk } = require("chalk");
const mongoose = require("mongoose");


class Utils {
  /**
   * @param {client} client
   */
  constructor(client) {
    this.client = client;
  }
  async startClient() {
    this.client.login(this.client.config.token);
    let table = new ascii("Commands")
    table.setHeading("Command", "Load Status");
    const commands = await globPromise(`${process.cwd()}/Commands/**/*.js`);
    commands.map((value) => {
      const file = require(value);
      const splitted = value.split("/");
      const directory = splitted[splitted.length - 2];

      if (file.name) {
        const properties = { directory, ...file };
        this.client.commands.set(file.name, properties);
        table.addRow(`${file.name}`, '✅ Normal Command Loaded')
      } else table.addRow(`${file.name || "Missing"}`, `❌ Command name is not a string or empty ${splitted[6] + "/" + splitted[7]}`)
      if (file.aliases && Array.isArray(file.aliases)) {
        file.aliases.forEach((alias) =>
          this.client.aliases.set(alias, file.name)
        );
      }
    });

    const eventFiles = await globPromise(`${process.cwd()}/Events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(
      `${process.cwd()}/SlashCommands/**/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
      const file = require(value);
      const splitted = value.split("/")
      if (file.name) {
        table.addRow(`${file.name}`, `✅ Slash Command Loaded.`)
      } else if (!file?.name) {
        table.addRow(`${file.name || "MISSING"}`, `❌ Slash Command name is not a string or empty ${splitted[6] + "/" + splitted[7]}`)
      }
      this.client.slashCommands.set(file.name, file);

      if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
      arrayOfSlashCommands.push(file);
    });
    
    this.client.on("ready", async () => {
      // Register for a single guild
      // await this.client.guilds.cache.get("server id").commands.set(arrayOfSlashCommands).then(() => {
      //   console.log(`Loaded all slash commands to ${this.client.guilds.cache.get("855814357904916492").name}`)
      // }); // server only slash command

      // Register for all the guilds the bot is in
      await this.client.application.commands.set(arrayOfSlashCommands).then(() => {
        console.log("Loaded global commands")
      }); // Global slash command
  });

    console.clear()
    console.log(table.toString())
    if (!mongooseConnectionString) return

    mongoose.connect(mongooseConnectionString);
    mongoose.connection.on("connected", () =>console.log(chalk.green.bold("Connected to the database.")))
    mongoose.connection.on("disconnected", () =>console.log(chalk.red.bold("Disconnected from the database.")))
    mongoose.connection.on("error", (error) => console.log(chalk.red.bold(`There was an error connecting to the database.\nError: ${error}`)))
  }
}

module.exports = Utils;
