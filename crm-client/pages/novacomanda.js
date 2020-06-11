import React, { useContext, useState } from 'react'
import Layout from '../Components/Layout'
import AssignClient from '../Components/Orders/AssignClient'
import AssignProduct from '../Components/Orders/AssignProduct'
import OrderRecap from '../Components/Orders/OrderRecap'
import Total from '../Components/Orders/Total'
import { useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'
import ContextOrder from '../Context/Orders/ContextOrder'

const NEW_ORDER = gql`
mutation newOrder($input: OrderInput) {
  newOrder(input: $input) {
    id
  }
}`

const GET_ORDERS = gql`
query getOrdersBySalesman {
  getOrdersBySalesman {
    id
    order{
      name
      quantity
    }
    total
    client {
      id
      name
      surname
      company
      email
      phone
    }
    stage
  }
}`

const NovaComanda = () => {

  const router = useRouter()

  const [messageError, setMessageEror] = useState(null)
  const [messageConfirm, setMessageConfirm] = useState(null)
  const contextOrder = useContext(ContextOrder)
  const { client, products, total } = contextOrder

  const [newOrder] = useMutation(NEW_ORDER, {
    update(cache, { data: { newOrder } }) {
      const { getOrdersBySalesman } = cache.readQuery({query: GET_ORDERS})
      cache.writeQuery({
        query: GET_ORDERS,
        data: {
          getOrdersBySalesman: [newOrder, ...getOrdersBySalesman]
        }
      })
    }
  })

  const cancelOrder = () => {
    return router.push('/comandes')
  }

  const validationOrder = () => {
    return !products.every(product => product.quantity > 0) || total === 0 || client.length === 0 ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
  }

  const saveNewOrder = async () => {
    const order = products.map(({ __typename, stock, ...product }) => product)
    try {
      const { data } = await newOrder({
        variables: {
          input: {
            client: client.id,
            total,
            order
          }
        }
      })
      setMessageConfirm(`La comanda s'ha creat correctament`)
      setTimeout(() => {
        setMessageConfirm(null)
        router.push('/comandes')
      }, 2000)
    } catch (error) {
      setMessageEror(error.message.replace('GraphQL error: ', ''))
      setTimeout(() => {
        setMessageEror(null)
      }, 3000)
    }
  }

  const showError = () => {
    return (
      <div className="bg-red-100 py-2 px-2 text-red-700 w-full my-3 max-w-sm text-center mx-auto border border-red-400 rounded">
        <p>{messageError}</p>
      </div>
    )
  }

  const showConfirm = () => {
    return (
      <div className="bg-teal-100 py-2 px-2 text-teal-700 w-full my-3 max-w-sm text-center mx-auto border border-teal-400 rounded">
        <p>{messageConfirm}</p>
      </div>
    )
  }

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="inline-block text-2xl text-gray-800 justify-center">Nova Comanda</h1>
        <button
          type="button"
          className="inline-block bg-red-700 opacity-75 w-full sm:w-auto uppercase text-sm rounded px-2 text-white hover:opacity-100"
          onClick={() => cancelOrder()}
        >Cancelar Comanda
        </button>
      </div>
      {messageError && showError()}
      {messageConfirm && showConfirm()}
      <div className="flex justify-center mt-3">
        <div className="w-full max-w-xl">
          <AssignClient />
          <AssignProduct />
          <OrderRecap />
          <Total />
          <button
            type="button"
            className={`bg-gray-700 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 rounded ${validationOrder()}`}
            onClick={() => saveNewOrder()}
          >Guardar Comanda</button>
        </div>
      </div>

    </Layout>
  )
}
export default NovaComanda