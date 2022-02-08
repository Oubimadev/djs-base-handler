const Command = require("../../Structures/Command");
const { MessageEmbed } = require("discord.js")
const moment = require('moment')
const yesno = {
  true: "Yes",
  false: "No"
}

module.exports = new Command({
  name: "emoji-info",
  description: "Get an emoji information",
  aliases: ["emoji"],
  category: "server",
  devOnly: false,
  guildOnly: false,
  usage: "<emoji>",
  run: async ({ message, args }) => {
    const regex = args.join(" ").replace(/^<a?:\w+:(\d+)>$/, "$1")
    const emoji = message.guild.emojis.cache.find((emoji) => emoji.name === args.join(" ") || emoji.id === regex)
    if (!emoji) return message.reply("That emoji is not in the server!");

    const emojiEmbed = new MessageEmbed()
      .setTitle("EMOJI INFORMATION")
      .addField("Name", `${emoji.name}`, true)
      .addField("ID", `${emoji.id}`, true)
      .addField("Animated", `${yesno[emoji.animated]}`, true)
      .addField("Added By", `${(await emoji.fetchAuthor()).tag}`, true)
      .addField("Added At", `${moment(emoji.createdTimestamp).format("LLL")}`, true)
      .addField("Emoji URL", `[Click Here](${emoji.url})`, true)
      .addField("Format", `\`\`\`${emoji}\`\`\``)
      .setColor("RANDOM")
      .setThumbnail(emoji.url)
    message.reply({ embeds: [emojiEmbed] })
  },
});
