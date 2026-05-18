import {

Client,

Environment

}

from
"@paypal/paypal-server-sdk"

export const paypal=

new Client({

clientCredentialsAuthCredentials:{

oAuthClientId:

process.env
.PAYPAL_CLIENT_ID!,

oAuthClientSecret:

process.env
.PAYPAL_SECRET!

},

environment:
Environment.Sandbox

})