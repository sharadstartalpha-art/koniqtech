export async function getPusherClient() {
  const Pusher = (await import("pusher-js")).default;

  return new Pusher(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,
    {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    }
  );
}