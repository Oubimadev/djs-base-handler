const SlashCommand = require("../../Structures/SlashCommand");
const ms = require('ms');

module.exports = new SlashCommand({
  name: "purge",
  description: "Clear messages in the channel",
  botPermissions: ["MANAGE_MESSAGES"],
  userPermissions: ["MANAGE_MESSAGES"],
  options: [{
    name: "amount",
    description: "The amount of messages to clear",
    type: "NUMBER",
    maxValue: 100,
    minValue: 1,
    required: true
  }],
  type: "CHAT_INPUT",
  run: async ({ interaction }) => {
    const amount = interaction.options.getNumber("amount")
    const messages = await interaction.channel.messages.fetch({ limit: amount })
    const filtered = messages.filter((msg) => Date.now() - msg.createdTimestamp < ms('14 days'));

    await interaction.channel.bulkDelete(filtered)
    const msg = await interaction.channel.send({ content: `✅ Cleared \`${amount}\` messages that has been sent over the past 14 days` })
    setTimeout(() => {
      msg.delete()
    }, ms('5 seconds'))
  },
});