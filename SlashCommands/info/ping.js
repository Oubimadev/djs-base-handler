const slashCommand = require("../../Structures/SlashCommand");

module.exports = new slashCommand({
  name: "ping",
  description: "Get client ws ping",
  type: "CHAT_INPUT",
  run: async ({ client, interaction }) => {
    const ping = (client.ws.ping).toLocaleString()
    interaction.reply({ content: `Ping: \`${ping}ms\`` })
  }
})