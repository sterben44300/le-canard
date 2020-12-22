const { VoiceConnection, User } = require("discord.js");
const { Command, CommandoMessage } = require("discord.js-commando");
const ytdl = require("ytdl-core");
const { UserNotInVoiceChannel } = require("../../strings.json");

module.exports = class PlayCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "play",
      aliases: ["p"],
      group: "music",
      memberName: "play",
      description: "Joue de la musique via un lien externe youtube.",
      args: [
        {
          key: "query",
          prompt: "Quel Musique veux tu lire ? ",
          type: "string",
        },
      ],
    });
  }
  /**
   *
   * @param {CommandoMessage} message
   * @param {String} query
   */
  async run(message, { query }) {
    const server = message.client.server;

    if (!message.member.voice.channel) {
      return message.say(UserNotInVoiceChannel);
    }

    await message.member.voice.channel.join().then((connection) => {
      if (server.currentVideo.url != "") {
        server.queue.push({ title: "", url: query });
        return message.say("Ajouté a la file d'attente !");
      }
      server.currentVideo = { title: "", url: query };
      this.runVideo(message, connection, query);
    });
  }
  /**
   *
   * @param {CommandoMessage} message
   * @param {VoiceConnection} connection
   * @param {*} video
   */
  async runVideo(message, connection, videoUrl) {
    const server = message.client.server;
    const dispatcher = connection.play(
      await ytdl(videoUrl, { filter: "audioonly" })
    );

    server.queue.shift();
    server.dispatcher = dispatcher;
    server.connection = connection;

    dispatcher.on("finish", () => {
      if (server.queue[0]) {
        server.currentVideo = server.queue[0];
        return this.runVideo(message, connection, server.currentVideo.url);
      }
    });

    return message.say("En train de jouer :notes:");
  }
};
