import React, { useContext } from 'react'
import ContextOrder from '../../Context/Orders/ContextOrder'

const Total = () => {
  const contextOrder = useContext(ContextOrder)
  const {total} = contextOrder
  const totalFloat = total.toFixed(2)

  return (
    <div className="flex items-center mt-5 justify-between bg-gray-300 p-3 border-solid border-2 border-gray-400">
      <h2 className="text-gray-800 text-lg">Total a pagar:</h2>
      <p className="text-gray-800 mt-0">{totalFloat}€</p>
    </div>
  )
}
export default Total