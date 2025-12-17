const express = require("express");
const cors = require("cors");
const admin = require("./firebaseAdmin");

const app = express();
app.use(cors());
app.use(express.json());

const topicSubscriptions = {
  news: new Set(),
};

app.post("/subscribe", async (req, res) => {
  const { token, topic } = req.body;

  await admin.messaging().subscribeToTopic(token, topic);

  if (!topicSubscriptions[topic]) {
    topicSubscriptions[topic] = new Set();
  }
  topicSubscriptions[topic].add(token);

  res.json({ success: true });
});

app.post("/unsubscribe", async (req, res) => {
  const { token, topic } = req.body;

  await admin.messaging().unsubscribeFromTopic(token, topic);

  topicSubscriptions[topic]?.delete(token);

  res.json({ success: true });
});

app.post("/send", async (req, res) => {
  const { topic, title, body } = req.body;

  const tokens = Array.from(topicSubscriptions[topic] || []);

  if (tokens.length === 0) {
    return res.json({
      success: true,
      message: "No subscribers for this topic",
    });
  }

  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      data: { title, body },
      webpush: {
        notification: { title, body },
      },
    });

    res.json({ success: true, response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
