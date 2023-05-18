const { Client, Partials, GatewayIntentBits, Collection, InteractionType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

const client = new Client({
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember
    ],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
});
const ayarlar = require("./ayarlar.json");
const fs = require("fs");
const { JsonDatabase } = require("wio.db");

const commandFiles = fs.readdirSync("./commands");
client.commands = new Collection();
commandFiles.map((cmd) => {
    if(cmd.endsWith(".js")) {
        let cmdProps = require("./commands/" + cmd);
        if(cmdProps.name == null || cmdProps.name == "") return console.log(`${cmd} name verisi girilmemiş.`);
        client.commands.set(cmdProps.name, cmdProps);
        cmdProps?.aliases?.map((alias) => {
            client.commands.set(alias, cmdProps);
        });
        console.log(`${cmdProps.name} komutu yüklendi.`);
    }
});

client.on("messageCreate", async(message) => {
    if(message.content.startsWith(ayarlar.prefix)) {
        const command = message.content.split(" ")[0].replace(ayarlar.prefix, "");
        const cmd = client.commands.get(command);
        if(cmd) {
            console.log(`${message.author.tag} (${message.author.id}) !${cmd.name} komutunu kullandı.`)
            cmd.run(client, message);
        }
    }
});
client.on("ready", async() => {
    console.log(client.user.username + " Aktif!")
})
client.on("interactionCreate", async(interaction) => {
    if(interaction.customId == "talepAc") {
        let channel =interaction.guild.channels.cache.filter(c => c.name == "ticket-" + interaction.member.id).first();
        if(channel != null) return interaction.reply({
            ephemeral: true,
            content: `Zaten bir destek talebin bulunuyor. ${channel}`
        });
        channel = await interaction.guild.channels.create({
            name: "ticket-" + interaction.member.id,
            permissionOverwrites: [
                {
                    id: interaction.member.id,
                    allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: "942408347099992136",
                    allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                }
            ]
        })
        let embed = new EmbedBuilder()
            .setDescription(`
Talebin açıldı! 

Açan ${interaction.member}
            `);
        let actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setEmoji("❌")
                .setLabel("Talebi kapat")
                .setCustomId("talepKapat")
        )
        channel.send({
            embeds: [embed],
            content: "@everyone",
            components: [actionRow]
        });
        interaction.reply({
            ephemeral: true,
            content: `Destek talebin başarıyla açıldı. ${channel}`
        })
    } else if(interaction.customId == "talepKapat") {
        interaction.channel.deletable ? interaction.channel.delete() : interaction.reply({
            content: "Kanalı silemiyorum."
        })
    }
});
client.login(ayarlar.client.token);