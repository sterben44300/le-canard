const { Command, CommandoMessage } = require("discord.js-commando");
const {
  BotNotInVoiceChannel,
  UserNotInVoiceChannel,
} = require("../../strings.json");

module.exports = class PauseCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "pause",
      group: "music",
      memberName: "pause",
      description: "Met en pause la musique.",
      ownerOnly: "true",
    });
  }
  /**
   *
   * @param {CommandoMessage} message
   * @param {String} query
   */
  async run(message) {
    const server = message.client.server;

    if (!message.member.voice.channel) {
      return message.say(UserNotInVoiceChannel);
    }
    if (!message.client.voice.connections.first) {
      return message.say(BotNotInVoiceChannel);
    }
    if (message.client.server.dispatcher) {
      server.dispatcher.pause();
      return message.say("Musique mis en pause :pause_button:");
    }
  }
};
