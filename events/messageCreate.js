const client = require("../index");
const Discord = require("discord.js");


client.on("messageCreate", async (message) => {
  if (
    message.author.bot ||
    !message.guild ||
    !message.content.toLowerCase().startsWith(client.config.prefix)
  )
    return;

  const [cmd, ...args] = message.content
    .slice(client.config.prefix.length)
    .trim()
    .split(/ +/g);

  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.get(client.aliases.get(cmd.toLowerCase()));

  if (!command) return;

  if (!message.member.permissions.has(command.userPermissions || [])) {
    const userPermission = new Discord.MessageEmbed()
      .setTitle("MISSING PERMISSIONS")
      .setDescription(`❌ | You are missing \`${command.userPermissions.join(", ").replace(/\_/g, " ")}\``)
      .setColor(client.colors.silver)
      .setTimestamp()
    return message.channel.send({ embeds: [userPermission] })
  }

  if (!message.guild.me.permissions.has(command.botPermissions || [])) {
    const userPermission = new Discord.MessageEmbed()
      .setTitle("MISSING PERMISSIONS")
      .setDescription(`❌ | I am missing \`${command.botPermissions.join(", ").replace(/\_/g, " ")}\``)
      .setColor(client.colors.silver)
      .setTimestamp()
    return message.channel.send({ embeds: [userPermission] })
  }

  if (command.devOnly == true && !["Your ID"].includes(message.author.id)) {
    const devOnlyCommand = new Discord.MessageEmbed()
      .setTitle("Developer Only Command")
      .setDescription(`❌ | This command is only for the developer`)
      .setColor("RED")
      .setTimestamp()
      return message.reply({ embeds: [devOnlyCommand] })
  }

  if (command.guildOnly == true && message.guildId !== "Server ID") {
    const guildOnlyCommand = new Discord.MessageEmbed()
      .setTitle("Guild Only Command")
      .setDescription(`❌ | This command is only for \`${client.guilds.cache.get("Server ID").name}\` server`)
      .setColor("")
      .setTimestamp()
    return message.reply({ embeds: [guildOnlyCommand] })
  }

  if (command.inDevelopment == true && !["Your ID"].includes(message.author.id)) {
    const inDevelopment = new Discord.MessageEmbed()
      .setTitle("Command In Development")
      .setDescription(`❌ | ${command.name} is still in development. Stay Tuned`)
      .setColor("RED")
      .setTimestamp()
    return message.reply({ embeds: [inDevelopment] })
  }

  await command.run({ client, message, args });
});
