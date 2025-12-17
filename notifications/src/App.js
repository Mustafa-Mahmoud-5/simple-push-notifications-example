import { useEffect, useState, useCallback } from "react";
import { messaging, requestNotificationPermission } from "./firebase";
import { onMessage } from "firebase/messaging";

function App() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");

  const subscribeToTopic = useCallback(
    async (topic) => {
      if (!token) return;

      await fetch("http://localhost:5000/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, topic }),
      });

      setStatus(`Subscribed to ${topic}`);
    },
    [token]
  );

  const unsubscribeFromTopic = useCallback(
    async (topic) => {
      if (!token) return;

      await fetch("http://localhost:5000/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, topic }),
      });

      setStatus(`Unsubscribed from ${topic}`);
    },
    [token]
  );

  useEffect(() => {
    const init = async () => {
      const fcmToken = await requestNotificationPermission();
      if (fcmToken) {
        setToken(fcmToken);

        await fetch("http://localhost:5000/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: fcmToken, topic: "news" }),
        });

        setStatus("Auto subscribed to news");
      }
    };
    init();

    onMessage(messaging, (payload) => {
      console.log("FOREGROUND MESSAGE:", payload.data);
    });
  }, [subscribeToTopic, unsubscribeFromTopic]);

  return (
    <div style={{ padding: 20 }}>
      <h1>FCM Foreground / Background</h1>

      <button onClick={() => subscribeToTopic("news")}>
        Subscribe to News
      </button>

      <button
        style={{ marginLeft: 10 }}
        onClick={() => unsubscribeFromTopic("news")}
      >
        Unsubscribe from News
      </button>

      <p>
        <strong>Status:</strong> {status}
      </p>

      <hr />

      <p>
        <strong>FCM Token:</strong>
      </p>
      <small style={{ wordBreak: "break-all" }}>{token}</small>
    </div>
  );
}

export default App;
