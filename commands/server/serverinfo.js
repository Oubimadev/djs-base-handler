const Command = require("../../Structures/Command");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = new Command({
  name: "server-info",
  description: "Get the server information",
  aliases: ["guild", "server", "si"],
  category: "information",
  inDevelopment: false,
  run: async ({ message }) => {
    const guild = message.guild;

    const serverEmbed = new MessageEmbed()
      .setTitle(`${guild.name} Information`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setColor("RANDOM")
      .addField("General Information", `
      **Server Owner:** \`(${(await guild.fetchOwner()).id}) ${(await guild.fetchOwner()).user.tag}\`
      **Server ID:** \`${guild.id}\`
      **Server Creation Date:** <t:${moment(guild.createdAt).format("X")}:R>
      **(Me) Joined At:** <t:${moment(guild.me.joinedAt).format("X")}:R>
      \u3000
      `)
      .addField("Channels", `
      **Total Channels:** \`${guild.channels.cache.size.toLocaleString()}\`
      **Category** \`${guild.channels.cache.filter((ch) => ch.type === "GUILD_CATEGORY").size.toLocaleString()}\`
      **Stage Channels:** \`${guild.channels.cache.filter((ch) => ch.type === "GUILD_STAGE_VOICE").size.toLocaleString()}\`
      **Voice Channels:** \`${guild.channels.cache.filter((ch) => ch.type === "GUILD_VOICE").size.toLocaleString()}\`
      **Text Channels:** \`${guild.channels.cache.filter((ch) => ch.type === "GUILD_TEXT").size.toLocaleString()}\`
      \u3000
      `)
      .addField("Members", `
      **Total Members:** \`${guild.memberCount.toLocaleString()}\`
      **Server Maximum Members:** \`${guild.maximumMembers.toLocaleString()}\`
      **Online Members:** \`${guild.presences.cache.filter((m) => m.status === "online").size.toLocaleString()}\`
      **Idle Members:** \`${guild.presences.cache.filter((m) => m.status === "idle").size.toLocaleString()}\`
      **DND Members:** \`${guild.presences.cache.filter((m) => m.status === "dnd").size.toLocaleString()}\`
      \u3000
      `)
      .addField("Emojis And Stickers", `
      **Total Emojis:** \`${guild.emojis.cache.size.toLocaleString()}\`
      **(Regular) Emojis:** \`${guild.emojis.cache.filter((e) => !e.animated).size.toLocaleString()}\`
      **(Animated) Emojis:** \`${guild.emojis.cache.filter((e) => e.animated).size.toLocaleString()}\`
      **Regular:** ${guild.emojis.cache.filter((e) => !e.animated).map((e) => e.toString()) || "There are no regular emojis in this server."}
      **Animated:** ${guild.emojis.cache.filter((e) => e.animated).map((e) => e.toString()) || "There are no animated emojis in this server."}
      \u3000
      `)
      .addField("Misc", `
      **Server Features:** \`${guild.features.join(", ")}\`
      **Server Boosts:** \`${guild.premiumTier}\`
      **Explicit Filter:** \`${guild.explicitContentFilter}\`
      **MFA Level:** \`${guild.mfaLevel}\`
      \u3000
      `)
      .setColor("RANDOM")
      .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    message.reply({ embeds: [serverEmbed] })
  },
});
