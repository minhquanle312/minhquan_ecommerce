// import Paypal from 'paypal-rest-sdk'

// Paypal.configure({
//   mode: 'sandbox', //sandbox or live
//   client_id:
//     'AUv1JutunLFxHB8Pb1VSRMrRlRpWZZduFg-36SPBkCRxCTlS06stRTYjtT5gjvNwBNPRIc02CME6fG3M',
//   client_secret:
//     'EL9fsML4cqpEZCdDxXcBhz2J1tQaZdXau0mTFh1gAG6gNrvPe6Pnk0p1k16dA5vVxIW_J-lznq3Ea9Gc',
// })

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     console.log('paypal', req.body)

//     const create_payment_json = {
//       intent: 'sale',
//       payer: {
//         payment_method: 'paypal',
//       },
//       redirect_urls: {
//         return_url: `${req.headers.origin}/success`,
//         cancel_url: `${req.headers.origin}/cancel`,
//       },
//       transactions: [
//         {
//           item_list: {
//             items: [
//               {
//                 name: 'Iphone 4S',
//                 sku: '001',
//                 price: '25.00',
//                 currency: 'USD',
//                 quantity: 1,
//               },
//             ],
//           },
//           amount: {
//             currency: 'USD',
//             total: '25.00',
//           },
//           description: 'Iphone 4S cũ giá siêu rẻ',
//         },
//       ],
//     }

//     Paypal.payment.create(create_payment_json, function (error, payment) {
//       if (error) {
//         throw error
//       } else {
//         for (let i = 0; i < payment.links.length; i++) {
//           if (payment.links[i].rel === 'approval_url') {
//             res.redirect(payment.links[i].href)
//           }
//         }
//       }
//     })
//   }
// }
