const Command = require("../../Structures/Command");
const DirEmojis = require('../../Emojis/DirEmojis');
const { MessageEmbed } = require("discord.js");
const { readdirSync } = require('fs');

module.exports = new Command({
  name: "help",
  description: "View all the bots command",
  aliases: ["h", "cmd", "cmds"],
  category: "bot",
  devOnly: false,
  guildOnly: false,
  usage: "<command>",
  run: async ({ client, message, args }) => {
    const prefix = client.config.prefix;
    if (!args.length) {
      let categories = [];
      const ignoredCategories = []; // categories to exclude.

      readdirSync("./commands/").forEach((dir) => {
        const editName = `${DirEmojis[dir] || ""}  ${dir.toUpperCase()}`;
        if (ignoredCategories.includes(dir.toLowerCase())) return;
        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        const cmds = commands
          .filter((command) => {
            let file = require(`../../commands/${dir}/${command}`);

            return !file.hidden;
          })
          .map((command) => {
            let file = require(`../../commands/${dir}/${command}`);

            if (!file.name) return "No command name.";

            let name = file.name.replace(".js", "");

            return `\`${name}\``;
          });

        let data = new Object();

        data = {
          name: `${editName} [${cmds.length}]`,
          value: cmds.join(" • ") || "```IN PROGRESS```",
        };

        categories.push(data);
      });

      const embed = new MessageEmbed()
        .setTitle("📬 Need help? Here are all of my commands:")
        .addFields(categories)
        .setDescription(
          `Use \`${prefix}help\` followed by a command name to get more additional information on a command. For example: \`${prefix}help ping\`.`
        )
        .setFooter({
          text: `Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({
            dynamic: true,
          }),
        })
        .setTimestamp()
        .setColor("RANDOM");
      return message.reply({ embeds: [embed] });
    } else {
      const cmd =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.get(client.aliases.get(args[0].toLowerCase()));

      if (!cmd) {
        const notACommand = new MessageEmbed()
          .setDescription(`\`${args[0]}\` is not a valid command use \`${prefix}help\` to view all of my commands`)
          .setColor("RED")
        return message.reply({ embeds: [notACommand] })
      }

      const CommandInfo = new MessageEmbed()
        .setTitle(`${cmd.name} info`)
        .setDescription(`>>> 
        Name: \`${cmd.name}\`,
        Description: \`${cmd.description}\`,
        Aliases: \`${cmd.aliases ? cmd.aliases.join(", ") : "No aliases"}\`,
        Category: \`${cmd.category}\`,
        Usage: \`${prefix}${cmd.name} ${cmd.usage || " "}\`,
        User Permissions: \`${cmd.userPermissions ? cmd.userPermissions.join(", ").replace(/\_/g, " ") : "No permissions needed"}\`,
        Bot Permissions: \`${cmd.botPermissions ? cmd.botPermissions.join(", ").replace(/\_/g, " ") : "No permissions needed"}\`
        `)
        .setColor("RANDOM")
        .setTimestamp();
      message.reply({ embeds: [CommandInfo] });
    }
  },
});
