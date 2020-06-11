import React, { useContext } from 'react'
import ContextOrder from '../../Context/Orders/ContextOrder'

const Total = () => {
  const contextOrder = useContext(ContextOrder)
  const {total} = contextOrder
  const totalFloat =new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(total)

  return (
    <div className="flex items-center mt-5 justify-between bg-gray-300 p-3 border-solid border-2 border-gray-400 rounded">
      <h2 className="text-gray-800 text-lg">Total a pagar:</h2>
      <p className="text-gray-800 mt-0">{totalFloat}</p>
    </div>
  )
}
export default Total