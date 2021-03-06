import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import Layout from '../Components/Layout'
import Order from '../Components/Order'

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

const Comandes = () => {

  const [orderStage, setOrderStage] = useState('')
  const [colorSelectStage, setColorSelectStage] = useState('')
  const [filterOrders, setFilterOrders] = useState([])

  useEffect(() => {
    if (orderStage) {
      setOrderStage(orderStage)
    }
    changeColorStage()
  }, [orderStage])

  const changeColorStage = () => {
    if (orderStage === "PENDENT") {
      setColorSelectStage('bg-yellow-500 border border-yellow-600 text-white')
    } else if (orderStage === "ACABADA") {
      setColorSelectStage('bg-green-500 border border-green-600 text-white')
    } else if (orderStage === "CANCELADA") {
      setColorSelectStage('bg-red-700 border border-red-800 text-white')
    } else {
      setColorSelectStage('border border-gray-300')
    }
  }
  const { data, loading, errors, startPolling, stopPolling } = useQuery(GET_ORDERS)
  useEffect(() => {
    startPolling(1000)
    return () => {
      stopPolling()
    }
  }, [startPolling, stopPolling])

  if (loading) return <p className="my-2 bg-blue-100 border-l-4 border-blue-700 p-4 text-center">Carregant...</p>
  const { getOrdersBySalesman } = data

  const filterStage = (newStage) => {
    setFilterOrders(getOrdersBySalesman.filter(
      (order) => order.stage === newStage
    ));
    setOrderStage(newStage);
  };

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800">Comandes</h1>
        <div className="flex inline-block">
          <p className="w-2/4 py-2">
            <Link href="/novacomanda">
              <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 uppercase">Nova Comanda</a>
            </Link>
          </p>
          <div className="flex w-2/4 inline-block items-center">
            <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 ml-2 mr-1 ml-5">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            <select
              className={`${colorSelectStage} mt-2 cursor-pointer appearance-none text-justify p-2 rounded uppercase text-sm bg-gray-200 border border-gray-600 text-black opacity-75 hover:opacity-100 `}
              value={orderStage}
              onChange={e => filterStage(e.target.value)}
            >
              <option value="TOTS ELS ESTATS">TOTS ELS ESTATS</option>
              <option className="bg-green-500 text-white" value="ACABADA">ACABADA</option>
              <option className="bg-yellow-500 text-white" value="PENDENT">PENDENT</option>
              <option className="bg-red-700 text-white" value="CANCELADA">CANCELADA</option>
            </select>
          </div>
        </div>
        {getOrdersBySalesman.length === 0 && filterOrders.length === 0 ? (
          <p className="mt-5 text-center text-2xl">Encara no hi ha comandes </p>
        ) : (
            filterOrders.length > 0 ? (
              filterOrders.map(order => (
                <Order key={order.id} order={order} />
              ))
            ) : (
                filterOrders.length === 0 && orderStage && orderStage !== "TOTS ELS ESTATS" ? (
                  <p className="mt-5 text-center text-2xl">No hi ha cap comanda {orderStage} </p>
                ) : (
                    getOrdersBySalesman.map((order, i) => (
                      <Order key={i} order={order} />
                    ))
                  )
              )
          )}
      </Layout>
    </div >
  )
}
export default Comandes
