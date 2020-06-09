import React, { useContext, useState, useEffect } from 'react'
import ContextOrder from '../../Context/Orders/ContextOrder'

const ProductRecap = ({ product }) => {
  const { name, price } = product

  const contextOrder = useContext(ContextOrder)
  const { productQuantity, updateTotalOrder } = contextOrder

  const [quantity, setQuantity] = useState(0)

  useEffect(() => {
    updateQuantity()
    updateTotalOrder()
  }, [quantity])

  const updateQuantity = () => {
    const newProduct = { ...product, quantity: Number(quantity) }
    productQuantity(newProduct);
  }

  const totalProduct = () => {
    const total = (price * quantity).toFixed(2) +'€'
    return total
  }

  return (
    <div className="md:flex md:justify-between md:items-center mt-5">
      <p className="inline-block md:w-2/6 text-sm">{name}</p>
      <p className="inline-block md:w-2/6">Preu: {price} €</p>
      <input
        type="number"
        placeholder="quantitat"
        className="inline-block md:w-1/6 shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 text-center leading-tight focus:outline-none focus:shadow-outline md:ml-4"
        onChange={e => setQuantity(e.target.value)}
        value={quantity}
      />
      <p className="inline-block md:w-1/6 shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 text-right leading-tight focus:outline-none focus:shadow-outline md:ml-4"
      >{totalProduct()}</p>
    </div>
  )
}
export default ProductRecap