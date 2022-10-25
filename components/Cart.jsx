import React, { useRef } from 'react'
import Link from 'next/link'
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from 'react-icons/ai'
import { TiDeleteOutline } from 'react-icons/ti'
import toast from 'react-hot-toast'

import { useStateContext } from '../context/StateContext'
import { urlFor } from '../lib/client'
import getStripe from '../lib/getStripe'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import axios from 'axios'

// const PayPalButton = paypal.Buttons.driver('react', { React, ReactDOM })

const Cart = () => {
  const cartRef = useRef()
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleCartItemQuanitity,
    onRemove,
  } = useStateContext()

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: '0.01',
          },
        },
      ],
    })
  }
  const onApprove = (data, actions) => {
    return actions.order.capture()
  }

  const handleCheckout = async () => {
    const stripe = await getStripe()

    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    })

    if (response.statusCode === 500) return

    const data = await response.json()

    toast.loading('Redirecting...')

    stripe.redirectToCheckout({ sessionId: data.id })
  }

  const handleCheckoutPaypal = async () => {
    const response = await fetch('/api/paypal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    })

    if (response.statusCode === 500) return

    const data = await response.json()

    toast.loading('Redirecting...')
  }

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>

        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div className="product" key={item._id}>
                <img
                  src={urlFor(item?.image[0])}
                  className="cart-product-image"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <h4>${item.price}</h4>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={() =>
                            toggleCartItemQuanitity(item._id, 'dec')
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num" onClick="">
                          {item.quantity}
                        </span>
                        <span
                          className="plus"
                          onClick={() =>
                            toggleCartItemQuanitity(item._id, 'inc')
                          }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => onRemove(item)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${totalPrice}</h3>
            </div>
            <div className="btn-container">
              <button type="button" className="btn" onClick={handleCheckout}>
                Pay with Stripe
              </button>
              {/* <button
                type="button"
                className="btn"
                onClick={handleCheckoutPaypal}
              >
                Pay with Paypal
              </button> */}
              {/* <PayPalButton
                createOrder={(data, actions) => this.createOrder(data, actions)}
                onApprove={(data, actions) => this.onApprove(data, actions)}
              /> */}
              <PayPalScriptProvider
                options={{
                  'client-id':
                    'AUv1JutunLFxHB8Pb1VSRMrRlRpWZZduFg-36SPBkCRxCTlS06stRTYjtT5gjvNwBNPRIc02CME6fG3M',
                }}
              >
                <PayPalButtons
                  style={{ layout: 'horizontal' }}
                  createOrder={async (data, actions) => {
                    try {
                      // const res = await axios({
                      //   url: 'http://localhost:3000/api/payment',
                      //   method: 'POST',
                      //   headers: {
                      //     'Content-Type': 'application/json',
                      //   },
                      // })
                      const res = await fetch('/api/payment', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(cartItems),
                      })
                      return res.data.id
                    } catch (error) {
                      console.log('error', error)
                    }
                    console.log(data, actions)

                    // return actions.order.create({})
                  }}
                  onCancel={(data) => console.log('Cancel payment')}
                  onApprove={(data, actions) => {
                    console.log('data', data)
                    actions.order.capture()
                  }}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
