let clientToReturn;

module.exports = {
    discordBotMain: function(){
        main()
        this.discordClient = () => {
            return clientToReturn
        }
    }
}

async function main(){
    
    const Discord = require('discord.js');
    const client = new Discord.Client(
        {
            intents: [
                "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING",
                "GUILDS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS",
                "GUILD_INVITES", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS",
                "GUILD_MESSAGE_TYPING", "GUILD_VOICE_STATES", "GUILD_WEBHOOKS",
                // "GUILD_PRESENCES"
            ],
            partials: ["CHANNEL"]
        }
    );
    client.config = require('./config.json')
    const fs = require('fs');
    let token = process.env.token || client.config.betaToken
    client.commands = new Discord.Collection();
    client.alts = new Discord.Collection();
    client.events = new Discord.Collection();

    if(token == process.env.token){
        const { AutoPoster } = require('topgg-autoposter')
        const ap = AutoPoster(client.config.dbl_token, client)
        ap.on('posted', () => {
            console.log('Discord: Posted discord bot stats to Top.gg!')
        })
    }

    const handlerFiles = fs.readdirSync('./discord/handlers/').filter(file => file.endsWith('.js'));
    handlerFiles.forEach(handler => {
        require('./handlers/' + handler)(client, Discord)
    })

    const { music } = require('./music')
    music(Discord, client)

    const { error } = require('./error')
    error(Discord, client)
    
    client.login(token)
    
    function returnDiscordClient(){
        return client;
    }
    clientToReturn = returnDiscordClient()
}