const { Command, CommandoMessage } = require("discord.js-commando");
const {
  BotNotInVoiceChannel,
  UserNotInVoiceChannel,
} = require("../../strings.json");

module.exports = class ResumeCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "resume",
      group: "music",
      memberName: "resume",
      description: "Remet la musique.",
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
      server.dispatcher.resume();
      return message.say("En train de jouer :notes:");
    }
  }
};
