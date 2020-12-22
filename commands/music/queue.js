const { MessageEmbed } = require("discord.js");
const { Command, CommandoMessage } = require("discord.js-commando");
const { BotNotInVoiceChannel } = require("../../strings.json");

module.exports = class QueueCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "queue",
      group: "music",
      memberName: "queue",
      description: "Affiche la file d'attente! ",
      args: [
        {
          key: "page",
          prompt: "Quel pages veux-tu affiché",
          default: 1,
          type: "integer",
        },
      ],
    });
  }
  /**
   *
   * @param {CommandoMessage} message
   * @param {Number} page
   */
  async run(message, { page }) {
    const server = message.client.server;
    if (!message.client.voice.connections.first) {
      return message.say(BotNotInVoiceCannel);
    }

    const numberOfItem = 10;
    const startingItem = (page - 1) * numberOfItem;
    const queueLength = server.queue.length;

    var itemPerPage = startingItem + numberOfItem;

    var totalPages = 1;

    var embed = new MessageEmbed()
      .setTitle(`File d'attente`)
      .setColor("RANDOM")
      .addField("En train de jouer: ", server.currentVideo.title);

    if (queueLength > 0) {
      var value = "";
      if (queueLength > numberOfItem) {
        totalPages = Math.ceil(queueLength / numberOfItem);
      }

      if (page < 0 || page > totalPages) {
        return message.say(":x: Cette page n'existe pas!");
      }

      if (queueLength - startingItem < numberOfItem) {
        itemPerPage = queueLength - startingItem + startingItem;
      }

      for (let i = startingItem; i < itemPerPage; i++) {
        const video = server.queue[i];
        value += "`" + (i + 1) + ".` " + video.title + "\n";
      }
      embed.addField("A venir: ", value);
    }
    embed.setFooter(`Pages ${page}/${totalPages}`);
    return message.say(embed);
  }
};
