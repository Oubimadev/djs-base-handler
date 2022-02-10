const client = require("./Client");
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

    
    const commandFiles = await globPromise(`${__dirname}/../commands/**/*.js`);
    commandFiles.map((value) => {
      const file = require(value);
      const splitted = value.split("/");
      const directory = splitted[splitted.length - 2];

      if (file.name) {
        const properties = { directory, ...file };
        this.client.commands.set(file.name, properties);
        table.addRow(file.name, "✅ loaded");
      } else {
        table.addRow(`${file.name || "Missing"}`, "❌ Not loaded ");
      }
      if (file.aliases && Array.isArray(file.aliases))
        file.aliases.forEach((alias) =>
          this.client.aliases.set(alias, file.name)
        );
    });

    // Events
    const eventFiles = await globPromise(`${__dirname}/../events/*.js`);
    eventFiles.map((value) => require(value));

    const slashCommands = await globPromise(
      `${__dirname}/../SlashCommands/**/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
      const file = require(value);
      if (file.name) {
        table.addRow(file.name, "✅ Loaded");
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
      // await this.client.guilds.cache
      // .get("Server ID Here")
      // .commands.set(arrayOfSlashCommands).then(() => {
      //   console.log(`Loaded command to ${this.client.guilds.cache.get("Server ID Here").name}`)
      // });

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
