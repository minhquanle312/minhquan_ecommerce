import React, { useRef, useState } from 'react'
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
// import axios from 'axios'

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

  const [show, setShow] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ErrorMessage, setErrorMessage] = useState('')
  const [orderID, setOrderID] = useState(false)

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: cartItems.map((item) => ({
          description: item.name,
          amount: {
            currency_code: 'USD',
            value: item.price * item.quantity,
          },
        })),
        // not needed if a shipping address is actually needed
        application_context: {
          shipping_preference: 'NO_SHIPPING',
        },
      })
      .then((orderID) => {
        // setOrderID(orderID)
        return orderID
      })
  }

  // check Approval
  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details
      // setSuccess(true)
    })
  }
  //capture likely error
  // const onError = (data, actions) => {
  //   setErrorMessage('An Error occured with your payment ')
  // }

  const handleCheckoutVnpay = async () => {
    const response = await fetch('/api/vnpay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    })

    if (response.statusCode === 500) return

    const data = await response.json()
    console.log('data', data)

    toast.loading('Redirecting...')
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
                Pay with MASTERCARD/VISA
              </button>
              <PayPalScriptProvider
                options={{
                  'client-id':
                    'AUv1JutunLFxHB8Pb1VSRMrRlRpWZZduFg-36SPBkCRxCTlS06stRTYjtT5gjvNwBNPRIc02CME6fG3M',
                }}
              >
                <PayPalButtons
                  style={{ layout: 'horizontal' }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                />
              </PayPalScriptProvider>
              <button
                type="button"
                className="btn"
                onClick={handleCheckoutVnpay}
              >
                Pay with VNPAY
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
