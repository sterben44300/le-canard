const { CommandoClient } = require("discord.js-commando");
const path = require("path");
const { title } = require("process");

const client = new CommandoClient({
  commandPrefix: "-",
  owner: "359413766565265409",
  invite: "https://discord.gg/vMSUnRFran",
});

client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerGroup("music", "Music")
  .registerCommandsIn(path.join(__dirname, "commands"));

client.server = {
  queue: [],
  currentVideo: { url: "", title: "Rien pour le moment !" },
  dispatcher: null,
  connection: null,
};

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("De la musique", { type: "LISTENING" });
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (!newState.channel) {
    client.server.currentVideo = { url: "", title: "Rien pour le moment !" };
    client.server.queue = [];
  }
});

client.on("error", (error) => console.error(error));

client.login(process.env.TOKEN);
