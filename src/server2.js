const tmi = require("tmi.js");
const io = require("socket.io-client");
const dotenv = require("dotenv");

dotenv.config();

const client = new tmi.Client({
  identity: {
    username: process.env.TWITCH_USERNAME ?? "",
    password: process.env.TWITCH_OAUTH_TOKEN ?? "",
  },
  channels: [
    "midudev",
    "revenant",
    "knekro",
    "reventxz",
    "jujalag",
    "sergiofferra",
    "ibai",
    "illojuan",
    "baitybait",
    "werlyb",
    "el_yuste",
  ],
});

const socket = io(process.env.SOCKETIO_URL ?? "", {
  extraHeaders: {
    TWITCH_BOT_KEY: process.env.TWITCH_BOT_KEY,
  },
});

client.connect().catch(console.error);

client.on("message", (_, tags, message, self) => {
  if (self) return;

  console.log(`${tags.username} in channel ${_} said: '${message}' ✍️`);

  socket.emit("chat-message", {
    username: tags.username,
    message,
    canal: _,
    subscriber: tags.subscriber,
    mod: tags.mod,
    roomId: tags["room-id"],
    firstMsg: tags["first-msg"],
    turbo: tags.turbo,
    userId: tags["user-id"],
  });
});
