import React, { useReducer } from 'react'
import ContextOrder from './ContextOrder'
import ReducerOrder from './ReducerOrder'

import {
  SELECT_CLIENT,
  SELECT_PRODUCT,
  PRODUCT_QUANTITY,
  UPDATE_TOTAL
} from '../../types'

const StateOrder = ({ children }) => {
  const initialState = {
    client: {},
    products: [],
    total: 0
  }
  const [state, dispatch] = useReducer(ReducerOrder, initialState)
  const addClient = client => {
    dispatch({
      type: SELECT_CLIENT,
      payload: client
    })
  }

  const addProduct = selectProducts => {
    let newState
    if (state.products.length > 0) {
      newState = selectProducts.map(product => {

        const newObject = state.products.find(productState => productState.id === product.id);
        return { ...product, ...newObject }
      })
    } else {
      newState = selectProducts;
    }
    dispatch({
      type: SELECT_PRODUCT,
      payload: newState
    })
  }

  const productQuantity = newProduct => {
    dispatch({
      type: PRODUCT_QUANTITY,
      payload: newProduct
    })
  }

  const updateTotalOrder = () => {
    dispatch({
      type: UPDATE_TOTAL
    })
  }
  return (
    <ContextOrder.Provider
      value={{
        client: state.client,
        products: state.products,
        total: state.total,
        addClient,
        addProduct,
        productQuantity,
        updateTotalOrder
      }}
    >
      {children}
    </ContextOrder.Provider>
  )
}
export default StateOrder



