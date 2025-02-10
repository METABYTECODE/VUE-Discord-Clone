const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;

// Подключение к MongoDB
mongoose.connect("mongodb://localhost:27017/discord_clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(session({ secret: "your_secret_key", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Модель пользователя
const User = mongoose.model("User", new mongoose.Schema({
  discordId: String,
  username: String,
  avatar: String,
  discriminator: String,
}));

// Модель сообщений (включая голосования)
const Message = mongoose.model("Message", new mongoose.Schema({
  senderId: String,
  recipientId: String,
  text: String,
  type: { type: String, default: "text" },
  pollData: {
    question: String,
    answers: [String],
    votes: { type: [Number], default: [] },
    voters: { type: [String], default: [] },
    votersData: { type: mongoose.Schema.Types.Mixed, default: {} }, // <-- Добавили
    allowMultiple: Boolean,
    expiresAt: Date, // Дата окончания голосования
  },
  timestamp: { type: Date, default: Date.now },
}));


// Авторизация через Discord
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
passport.use(
  new DiscordStrategy(
    {
      clientID: "CLIENTID",
      clientSecret: "CLIENT SECRET",
      callbackURL: "http://localhost:3000/auth/discord/callback",
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ discordId: profile.id });
      if (!user) {
        user = await User.create({
          discordId: profile.id,
          username: profile.username,
          avatar: profile.avatar,
          discriminator: profile.discriminator,
        });
      }
      done(null, user);
    }
  )
);

app.get("/auth/discord", passport.authenticate("discord", { scope: ["identify"] }));
app.get("/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => res.redirect("http://localhost:5173")
);

app.get("/me", (req, res) => {
  if (!req.user) return res.status(401).send("Not authenticated");
  res.send(req.user);
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "discordId username avatar discriminator");
    const formattedUsers = users.map((user) => ({
      id: user.discordId,
      username: user.username,
      avatar: user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
        : "https://cdn.discordapp.com/embed/avatars/0.png",
    }));
    res.json(formattedUsers);
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    res.status(500).send("Ошибка сервера");
  }
});

// Получение сообщений между двумя пользователями
app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.discordId;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, recipientId: userId },
        { senderId: userId, recipientId: currentUserId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages || []); // Всегда возвращаем массив
  } catch (error) {
    console.error("Ошибка при получении сообщений:", error);
    res.status(500).send("Ошибка сервера");
  }
});


// Отправка нового сообщения (включая голосования)
app.post("/messages", async (req, res) => {
  const { recipientId, text, pollData, type } = req.body;
  const senderId = req.user.discordId;

  if (!recipientId || (!text && type === "text")) {
    return res.status(400).json({ error: "Неполные данные" });
  }

  try {
    const message = await Message.create({
      senderId,
      recipientId,
      text: text ?? "",  // ✅ Если text == null, заменяем на ""
      type: type || "text", // ✅ Если type пустой, ставим "text"
      pollData: type === "poll"
        ? {
            ...pollData,
            votes: new Array(pollData.answers.length).fill(0),
            voters: [],
            expiresAt: new Date(Date.now() + pollData.duration.value * 60 * 60 * 1000),
          }
        : null,
    });
    res.json(message);
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


// Голосование в опросе
app.post("/polls/vote", async (req, res) => {
  const { pollId, answerIndexes } = req.body;
  const userId = req.user.discordId;

  try {
    const pollMessage = await Message.findById(pollId);

    if (!pollMessage || pollMessage.type !== "poll") {
      return res.status(404).json({ error: "Опрос не найден" });
    }

    // Проверка срока голосования
    if (new Date() > new Date(pollMessage.pollData.expiresAt)) {
      return res.status(403).json({ error: "Голосование завершено" });
    }

    // Проверка, голосовал ли пользователь раньше
    if (pollMessage.pollData.voters.includes(userId)) {
      return res.status(400).json({ error: "Вы уже голосовали" });
    }

    // Обновляем голоса
    answerIndexes.forEach((index) => {
      if (pollMessage.pollData.votes[index] !== undefined) {
        pollMessage.pollData.votes[index]++;
      }
    });

    // Добавляем пользователя в список проголосовавших
    pollMessage.pollData.voters.push(userId);

    // ✅ Исправляем votersData (теперь сохраняет всех голосовавших)
    if (!pollMessage.pollData.votersData) {
      pollMessage.pollData.votersData = {};
    }
    pollMessage.pollData.votersData = {
      ...pollMessage.pollData.votersData, // Сохраняем старые данные
      [userId]: answerIndexes, // Добавляем текущего пользователя
    };

    await pollMessage.save();
    res.json(pollMessage.pollData);
  } catch (error) {
    console.error("Ошибка при голосовании:", error);
    res.status(500).send("Ошибка сервера");
  }
});


// Получение данных голосования
app.get("/polls/:pollId", async (req, res) => {
  try {
    const pollMessage = await Message.findById(req.params.pollId);
    if (!pollMessage || pollMessage.type !== "poll") {
      return res.status(404).json({ error: "Опрос не найден" });
    }
    res.json(pollMessage.pollData);
  } catch (error) {
    console.error("Ошибка при получении данных опроса:", error);
    res.status(500).send("Ошибка сервера");
  }
});

app.post("/polls/remove-vote", async (req, res) => {
  const { pollId } = req.body;
  const userId = req.user.discordId;

  try {
    const pollMessage = await Message.findById(pollId);

    if (!pollMessage || pollMessage.type !== "poll") {
      return res.status(404).json({ error: "Опрос не найден" });
    }

    // Проверка срока голосования
    if (new Date() > new Date(pollMessage.pollData.expiresAt)) {
      return res.status(403).json({ error: "Голосование завершено" });
    }

    // Проверяем, голосовал ли пользователь
    if (!pollMessage.pollData.voters.includes(userId)) {
      return res.status(400).json({ error: "Вы еще не голосовали" });
    }

    // Убираем пользователя из списка проголосовавших
    pollMessage.pollData.voters = pollMessage.pollData.voters.filter((id) => id !== userId);

    // Убираем выбор пользователя
    const userVotes = pollMessage.pollData.votersData[userId] || [];
    userVotes.forEach((index) => {
      if (pollMessage.pollData.votes[index] !== undefined) {
        pollMessage.pollData.votes[index]--;
      }
    });

    // Удаляем запись из votersData
    delete pollMessage.pollData.votersData[userId];

    await pollMessage.save();
    res.json(pollMessage.pollData);
  } catch (error) {
    console.error("Ошибка при удалении голоса:", error);
    res.status(500).send("Ошибка сервера");
  }
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));
