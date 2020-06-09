import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client'
import Swal from 'sweetalert2'

const UPDATE_ORDER = gql`
mutation updateOrder($id:ID!, $input: OrderInput) {
  updateOrder(id:$id, input: $input) {
    stage
  }
}`

const DELETE_ORDER = gql`
mutation deleteOrder($id: ID!) {
  deleteOrder(id: $id) 
}`

const GET_ORDERS = gql`
query getOrdersBySalesman {
  getOrdersBySalesman {
    id
    stage
  }
}`

const Order = ({ order }) => {
  const { id, total, client: { name, surname, company, email, phone }, stage, client } = order
  const totalFloat = total.toFixed(2)
  const [orderStage, setOrderStage] = useState(stage)
  const [colorStage, setColorStage] = useState('')

  const [updateOrder] = useMutation(UPDATE_ORDER)

  const [deleteOrder] = useMutation(DELETE_ORDER, {
    update(cache) {
      const { getOrdersBySalesman } = cache.readQuery({ query: GET_ORDERS })
      cache.writeQuery({
        query: GET_ORDERS,
        data: {
          getOrdersBySalesman: getOrdersBySalesman.filter(currentOrder => currentOrder.id !== id)
        }
      })
    }
  })

  useEffect(() => {
    if (orderStage) {
      setOrderStage(orderStage)
    }
    changeColorStage()
  }, [orderStage])

  const changeColorStage = () => {
    if (orderStage === "PENDENT") {
      setColorStage('border-yellow-500')
    } else if (orderStage === "ACABADA") {
      setColorStage('border-green-500')
    } else {
      setColorStage('border-red-700')
    }
  }

  const changeStage = async newStage => {
    try {
      const { data } = await updateOrder({
        variables: {
          id,
          input: {
            stage: newStage,
            client: client.id
          }
        }
      })
      setOrderStage(data.updateOrder.stage);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteOrderById = () => {
    Swal.fire({
      html: `Estàs segur d'eliminar aquesta comanda? <br> Aquesta acció no és pot desfer`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then(async (result) => {
      if (result.value) {
        try {
          const { data } = await deleteOrder({
            variables: { id }
          })
          Swal.fire(
            'Eliminat',
            data.deleteOrder)
        } catch (error) { console.log(error) }
      }
    })

  }

  return (
    <div className={`${colorStage} border-2 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
      <div>
        <p className="font-bold text-gray-800">Empresa: {company}</p>
        <p className="flex items-center my-2">Client: {name} {surname}</p>
        <p className="flex items-center my-2">
          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          email: {email} </p>
        {phone && (
          <p className="flex items-center my-2">
            <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-2">><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          phone: {phone}</p>
        )}
        <h2 className="text-gray-800 font-bold mt-8">Estat comanda:</h2>
        <select
          className="mt-2 cursor-pointer appearance-none bg-blue-600 border border-blue-600 text-white text-justify p-2 rounded focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold "
          value={orderStage}
          onChange={e => changeStage(e.target.value)}
        >
          <option className=" align-itemtext-center" value="ACABADA">ACABADA</option>
          <option className="text-center" value="PENDENT">PENDENT</option>
          <option className="text-center" value="CANCELADA">CANCELADA</option>
        </select>
      </div>
      <div className="ml-4">
        <h2 className="text-gray-800 font-bold mt-2">Resum comanda: </h2>
        {order.order.map((item, i) => (
          <div key={i} className="mt-4">
            <p className="text-sm text-gray-600">Producte: {item.name} </p>
            <p className="text-sm text-gray-600">Quantitat: {item.quantity}</p>
          </div>
        ))}
        <p className="text-gray-800 mt-3 font-bold">Total a pagar:
          <span className="font-light"> {totalFloat}€</span>
        </p>
        <button
          className="flex items-center mt-4 bg-red-700 p-2 inline-block text-sm text-white rounded leading-tight uppercase test-xs font-bold"
          onClick={() => deleteOrderById()}
        >
          Eliminar
          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 ml-2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    </div>
  )
}
export default Order