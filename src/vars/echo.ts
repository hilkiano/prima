import Echo from "laravel-echo";
import Pusher from "pusher-js";

const echo = new Echo({
  Pusher: Pusher,
  broadcaster: "reverb",
  key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
  wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
  wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 80,
  wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 443,
  forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
});

export default echo;
