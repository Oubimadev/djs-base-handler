const DirEmojis = require("../../Emojis/SlashCommandDirEmojis");
const SlashCommand = require("../../Structures/SlashCommand");
const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = new SlashCommand({
  name: "help",
  description: "Help Command",
  options: [
    {
      name: "cmd",
      description: "Get this command information",
      type: "STRING",
      required: false,
    },
  ],
  type: "CHAT_INPUT",
  run: async ({ interaction, client }) => {
    const command = interaction.options.getString("cmd");
    if (!command) {
      let categories = [];
      const ignoredCategories = []; // categories to exclude.

      readdirSync("./SlashCommands/").forEach((dir) => {
        const editName = `${DirEmojis[dir] || ""}  ${dir.toUpperCase()}`;
        if (ignoredCategories.includes(dir.toLowerCase())) return;
        const commands = readdirSync(`./SlashCommands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        const cmds = commands
          .filter((command) => {
            let file = require(`../../SlashCommands/${dir}/${command}`);

            return !file.hidden;
          })
          .map((command) => {
            let file = require(`../../SlashCommands/${dir}/${command}`);

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
          `Use \`/help\` followed by a command name to get more additional information on a command. For example: \`/help ping\`.`
        )
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({
            dynamic: true,
          }),
        })
        .setTimestamp()
        .setColor("RANDOM");
      return interaction.reply({ embeds: [embed] });
    } else {
      const cmd = client.slashCommands.get(command.toLowerCase());

      if (!cmd) {
        const notACommand = new MessageEmbed()
          .setDescription(
            `\`/${command}\` is not a command \`/help\` to view all the slash commands.`
          )
          .setColor("RED");
        return interaction.reply({ embeds: [notACommand], ephemeral: true });
      }

      const CommandInfo = new MessageEmbed()
        .setTitle(`${cmd.name} info`)
        .setDescription(
          `
        >>> Name: \`${cmd.name}\`,
        Description: \`${cmd.description}\`,
        User Permissions: \`${
          cmd.userPermissions
            ? cmd.userPermissions.join(", ").replace(/\_/g, " ")
            : "No permissions needed"
        }\`,
        Bot Permissions: \`${
          cmd.botPermissions
            ? cmd.botPermissions.join(", ").replace(/\_/g, " ")
            : "No permissions needed"
        }\`
        `
        )
        .setColor("RANDOM")
        .setTimestamp();
      return interaction.reply({ embeds: [CommandInfo] });
    }
  },
});
