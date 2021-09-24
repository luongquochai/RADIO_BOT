const express = require('express');
const app = express();
const port = 8001;

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
//----------------------------------------------BOT CODING---------------------
const Discord = require("discord.js"); //Import all libraries
const ytdl = require("ytdl-core");
const config = require("./config.json") //define Config
const mySecret = process.env['token']

const client = new Discord.Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  disableMentions: "all",
  shards: "auto",
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});//set new Client

//Fires when the Bot has started
client.on("ready", () => {
    radioexecuteadmin(client); //call the function
    client.user.setActivity("🎶 24/7 Music 🎶", { type: "PLAYING" }); //set Bot activity 
    console.log(`${client.user.username} ready!`); //Log that the Bot is ready
});
//recognise if someone joins the channel
client.on('voiceStateUpdate', async (oldState, newState) => {
    try {
        if (newState.channel.id === config.voicechannel) { // if its the channel
            if (newState.channel.members.size > 2) return; //if there are more then 2 members return
            if (newState.member.id === client.user.id) return; // if the member is the Bot return
            if (newState.member.user.bot) return //if its a Bot return
            radioexecuteadmin(); //call the function
        }
    }
    catch {
    }
});



//login the Bot | Start the Bot
client.login(mySecret);
//function to execute the Bot
async function radioexecuteadmin() {
    const voiceChannel = client.guilds.cache.get(config.guildid).channels.cache.get(config.voicechannel); //define the Voice Channel
    await voiceChannel.leave(); // leave the channel
    await delay(300); // wait 300ms to provent a bug
    var connection = await voiceChannel.join();//join the channel and
    await connection.voice.setSelfDeaf(true); await connection.voice.setDeaf(true); //selfdeaf
    // connection.setVolume(30);
    const dispatcher = connection.play(ytdl("https://youtu.be/DquKMopzJEY", { highWaterMark: 1024* 1024* 64,quality: "highestaudio"})); //You can replace the './audifile.mp3' with any sort of Radio stream for example: 'https://streams.ilovemusic.de/iloveradio17.mp3'
    dispatcher.setVolume(0.5);
    dispatcher.on("end", end => { radioexecuteadmin() });
}
//delay function
function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}