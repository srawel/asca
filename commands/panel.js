const { Client, Message, EmbedBuilder, ActionRowBuilder,ButtonBuilder,ButtonStyle,PermissionsBitField} = require("discord.js");
module.exports = {
    name: "panel",
    aliases: ["ticket"],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async(client, message) => {
        if(!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({
            content: "Bunun için yetkiniz yok!"
        })
        const embed = new EmbedBuilder()
            .setDescription(`
Destek talebi oluşturmak için aşağıdaki butona tıklamanız yeterli olacaktır. Yetkili ekibimiz en kısa süre içerisinde size dönüş yapacaktır, anlayışınız için teşekkürler.

**NOT: Taleplerdeki mesajlar kayıt altına alınmaktadır!**
                `);
        
        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("talepAc")
                .setEmoji("🎫")
                .setLabel("Talep Oluştur")
                .setStyle(ButtonStyle.Primary)
        );

        message.reply({
            embeds: [embed],
            components: [actionRow]
        })
    }
}