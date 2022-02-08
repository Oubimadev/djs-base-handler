const { default: chalk } = require("chalk");
const client = require("../index");

client.on("ready", () => {
  console.log(chalk.greenBright(`Logged in as ${client.user.tag}`))
  client.user.setActivity({ name: `${client.config.prefix}help`, type: "PLAYING" });
});
