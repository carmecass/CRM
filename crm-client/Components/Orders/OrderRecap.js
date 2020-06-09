import React, { useContext } from 'react'
import ContextOrder from '../../Context/Orders/ContextOrder'
import ProductRecap from '../../Components/Orders/ProductRecap'

const OrderRecap = () => {
  const contextOrder = useContext(ContextOrder)
  let { products } = contextOrder

  products = products.filter(Boolean)

  return (
    <>
      {products.length > 0 ? (
        <>
          {products.map(product => (
            <ProductRecap key={product.id} product={product} />
          ))}
        </>
      ) : (
          <p className="m-3">Encara no hi ha productes </p>
        )}
    </>
  )
}
export default OrderRecap