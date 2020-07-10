import { useEffect } from 'react'
import Layout from '../Components/Layout'
import { gql, useQuery } from '@apollo/client'
import Product from '../Components/Product'
import Link from 'next/link'

const GET_PRODUCTS = gql`
  query getProducts{
  getProducts{
    id
    name
    stock
    price
  }
}`

const Productes = () => {

  const { data=[], loading, error, startPolling, stopPolling } = useQuery(GET_PRODUCTS)

  useEffect(() => {
    startPolling(100)
    return () => {
      stopPolling()
    }
  }, [startPolling, stopPolling])

  if (loading) return <p className="my-2 bg-blue-100 border-l-4 border-blue-700 p-4 text-center">Carregant...</p>

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800">Productes</h1>
        <Link href="/nouproducte">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 uppercase w-full lg:w-auto text-center">Nou Producte</a>
        </Link>
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Nom</th>
              <th className="w-1/5 py-2">Stock</th>
              <th className="w-1/5 py-2">Preu</th>
              <th className="w-1/5 py-2">Eliminar</th>
              <th className="w-1/5 py-2">Editar</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.getProducts.map(product => (
              <Product key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </Layout>
    </div>
  )
}
export default Productes
