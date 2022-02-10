const { MessageEmbed, Formatters } = require("discord.js");
const client = require("../index");

client.on("interactionCreate", async (interaction) => {
  // Slash Command Handling
  if (interaction.isCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return interaction.followUp({ content: "An error has occured " });

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );

    if (!interaction.member.permissions.has(cmd.userPermissions || [])) {
      const notPermissions = new MessageEmbed()
        .setTitle("Missing Permissions")
        .setColor("RED")
        .setDescription(`❌ | You are missing [\`${cmd.userPermissions.join(", ").replace(/\_/g, " ")}\`] permissions`)
        .setTimestamp()
      return interaction.followUp({ embeds: [notPermissions] })
    }

    if (!interaction.guild.me.permissions.has(cmd.botPermissions || [])) {
      const notPermissions = new MessageEmbed()
        .setTitle("Missing Permissions")
        .setColor("RED")
        .setDescription(`❌ | I am missing [\`${cmd.botPermissions.join(", ").replace(/\_/g, " ")}\`] permissions`)
        .setTimestamp()
      return interaction.followUp({ embeds: [notPermissions] })
    }

    cmd.run({ client, interaction, args });
  }

  // Context Menu Handling
  if (interaction.isContextMenu()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (command) command.run({ client, interaction });
  }
});
