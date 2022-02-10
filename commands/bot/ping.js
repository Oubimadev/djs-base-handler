const Command = require("../../Structures/Command");

module.exports = new Command({
  name: "ping",
  description: "Send client websocket ping",
  category: "bot",
  run: async ({ client, message }) => {
    const msg = await message.channel.send({ content: "Pinging. . ." })
    message.channel.send({content: `**Websocket Ping:** \`${Math.round(client.ws.ping).toLocaleString()}ms\`\n**Message:** \`${Math.round(msg.createdTimestamp - message.createdTimestamp).toLocaleString()}ms\``,
    });
  },
});
