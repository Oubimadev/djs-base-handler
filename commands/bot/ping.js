const Command = require("../../Structures/Command");

module.exports = new Command({
  name: "ping",
  description: "Send client websocket ping",
  category: "bot",
  run: async ({ client, message }) => {
    message.channel.send({ content: `**Websocket Ping:** \`${Math.round(client.ws.ping).toLocaleString()}ms\`` })
  },
});