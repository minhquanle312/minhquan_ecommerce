import Paypal from '@paypal/checkout-server-sdk'

let clientId =
  'AUv1JutunLFxHB8Pb1VSRMrRlRpWZZduFg-36SPBkCRxCTlS06stRTYjtT5gjvNwBNPRIc02CME6fG3M'
let clientSecret =
  'EL9fsML4cqpEZCdDxXcBhz2J1tQaZdXau0mTFh1gAG6gNrvPe6Pnk0p1k16dA5vVxIW_J-lznq3Ea9Gc'

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new Paypal.core.SandboxEnvironment(clientId, clientSecret)
let client = new Paypal.core.PayPalHttpClient(environment)

const configureEnvironment = function () {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  return process.env.NODE_ENV === 'production'
    ? new Paypal.core.LiveEnvironment(clientId, clientSecret)
    : new Paypal.core.SandboxEnvironment(clientId, clientSecret)
}

// const client = function () {
//   return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment())
// }

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // console.log('req', req)
    const request = new Paypal.orders.OrdersCreateRequest()
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '100.00',
          },
        },
      ],
    })
    const response = await client.execute(request)

    return res.json({ id: response.result.id })
  }
}
