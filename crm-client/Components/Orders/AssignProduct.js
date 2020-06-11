import React, { useContext, useState, useEffect } from 'react'
import Select from 'react-select'
import { gql, useQuery } from '@apollo/client'
import ContextOrder from '../../Context/Orders/ContextOrder'


const GET_PRODUCTS = gql`
  query getProducts{
  getProducts{
    id
    name
    stock
    price
  }
}`

const AssignProduct = () => {
  const [products, setProducts] = useState([])
  const contextOrder = useContext(ContextOrder)
  const { addProduct } = contextOrder

  const { data, loading, error, startPolling, stopPolling } = useQuery(GET_PRODUCTS)

  useEffect(() => {
    startPolling(1000)
    return () => {
      stopPolling()
    }
  }, [startPolling, stopPolling])

  useEffect(() => {
    addProduct(products)
  }, [products])

  const selectProduct = product => {
    setProducts(product)
  }

  if (loading) return null

  const { getProducts } = data

  return (<>
    <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm rounded">Selecciona o busca els productes</p>
    <Select
      className="mt-3"
      options={getProducts}
      onChange={option => selectProduct(option)}
      isMulti={true}
      getOptionValue={item => item.id}
      getOptionLabel={item => `${item.name} - stock: ${item.stock}`}
      placeholder="Selecciona els productes"
      noOptionsMessage={() => "No hi ha resultats"}
    />
  </>)
}
export default AssignProduct