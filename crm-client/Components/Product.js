import React from 'react'
import Router from 'next/router'
import { gql, useMutation } from '@apollo/client'
import Swal from 'sweetalert2'

const DELETE_PRODUCT = gql`
mutation deleteProduct($id: ID!) {
  deleteProduct(id: $id)
}`

const GET_PRODUCTS = gql`
  query getProducts{
  getProducts{
    id
    name
    stock
    price
  }
}`

const Product = ({ product }) => {

  const { id, name, stock, price } = product
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    update(cache) {
      const { getProducts } = cache.readQuery({ query: GET_PRODUCTS })
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          getProducts: getProducts.filter(currentProduct => currentProduct.id !== id)
        }
      })
    }
  })

  const editProduct = (id) => {
    Router.push({
      pathname: '/editarproducte/[id]',
      query: { id }
    })
  }

  const deleteProductById = (id) => {
    Swal.fire({
      html: `Estàs segur d'eliminar aquest producte? <br> Aquesta acció no és pot desfer`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then(async (result) => {
      if (result.value) {
        try {
          const { data } = await deleteProduct({
            variables: {id }
          })
          Swal.fire(
            'Eliminat',
            data.deleteClient,
          )
        } catch (error) { console.log(error) }
      }
    })
  }

  return (
    <tr key={id}>
      <td className="border px-4 py-2">{name}</td>
      <td className="border px-4 py-2">{stock}</td>
      <td className="border px-4 py-2">{price} €</td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-red-700 py-2 px-4 w-full text-white rounded text-xs uppercase"
          onClick={() => deleteProductById(id)}
        >Eliminar
        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 ml-2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase"
          onClick={() => editProduct(id)}
        >Editar
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 ml-2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        </button>
      </td>
    </tr>
  )
}
export default Product
