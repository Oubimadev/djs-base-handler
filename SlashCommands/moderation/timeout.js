const SlashCommand = require("../../Structures/SlashCommand");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = new SlashCommand({
  name: "timeout",
  description: "Put a member in timeout",
  botPermissions: ["MODERATE_MEMBERS"],
  userPermissions: ["MODERATE_MEMBERS"],
  options: [
    {
      name: "user",
      description: "A user to timeout.",
      type: "USER",
      required: true,
    },
    {
      name: "duration",
      description: "A duration for the timeout.",
      type: "STRING",
      required: true,
    },
    {
      name: "reason",
      description: "A reason for timeouting this user",
      type: "STRING",
      required: true,
    },
  ],
  type: "CHAT_INPUT",
  run: async ({ interaction }) => {
    const user = interaction.options.getUser("user");
    const time = interaction.options.getString("duration");
    const reason = interaction.options.getString("reason");
    let member = interaction.guild.members.cache.get(user.id)

    const timeinms = ms(time)
    if (!timeinms) return interaction.followUp({ content: "How long will you timeout this user?", ephemeral: true })

    member.timeout(timeinms, reason)
    interaction.followUp({ content: `${member} has been timed out for \`${time}\` (${reason})` })
  },
});
