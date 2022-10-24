import { paypal } from '@paypal/checkout-server-sdk'

let clientId =
  'AUv1JutunLFxHB8Pb1VSRMrRlRpWZZduFg-36SPBkCRxCTlS06stRTYjtT5gjvNwBNPRIc02CME6fG3M'
let clientSecret =
  'EL9fsML4cqpEZCdDxXcBhz2J1tQaZdXau0mTFh1gAG6gNrvPe6Pnk0p1k16dA5vVxIW_J-lznq3Ea9Gc'

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret)
let client = new paypal.core.PayPalHttpClient(environment)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('req', req)
    const request = new paypal.orders.OrdersCreateRequest()
    request.requestBody({
      id: req._id,
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
