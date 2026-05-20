import webpush from "web-push"

webpush.setVapidDetails(

"mailto:admin@koniqtech.com",

process.env.VAPID_PUBLIC || "",

process.env.VAPID_PRIVATE || ""

)

export default webpush