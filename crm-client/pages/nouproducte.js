import React, { useState } from 'react'
import Layout from '../Components/Layout'
import { gql, useMutation } from '@apollo/client'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/router'

const NEW_PRODUCT = gql`
mutation newProduct($input: ProductInput) {
  newProduct(input:$input) {
    id
    name
    stock
    price
    date_creation
  }
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

const NouProducte = () => {

  const router = useRouter()
  const [messageError, setMessageError] = useState(null)
  const [messageConfirm, setMessageConfirm] = useState(null)

  const [newProduct] = useMutation(NEW_PRODUCT, {
    update(cache, { data: { newProduct } }) {
      const { getProducts } = cache.readQuery({ query: GET_PRODUCTS })
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          getProducts: [newProduct, ...getProducts]
        }
      })
    }
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      stock: '',
      price: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nom és obligatori'),
      stock: Yup.number()
        .required('El stock és obligatori')
        .positive(`No s'admeten números negatius`)
        .integer('El stock ha de ser un número enter'),
      price: Yup.number()
        .required('El preu és obligatori')
        .positive(`No s'admeten números negatius`)
    }),
    onSubmit: async values => {
      const { name, stock, price } = values
      try {
        const { data } = await newProduct({
          variables: {
            input: {
              name,
              stock,
              price
            }
          }
        })
        setMessageConfirm(`El producte ${data.newProduct.name}  s'ha creat correctament`)
        setTimeout(() => {
          setMessageConfirm(null)
          router.push('/productes')
        }, 2000)
      } catch (error) {
        setMessageError(error.message.replace('GraphQL error: ', ''))
        setTimeout(() => {
          setMessageError(null)
        }, 2000)
      }
    }
  })

  const cancelProduct = () => {
    return router.push('/productes')
  }

  const showError = () => {
    return (
      <div className="bg-red-100 py-2 px-2 text-red-700 w-full my-3 max-w-sm text-center mx-auto border border-red-400 rounded">
        <p>{messageError}</p>
      </div>
    )
  }

  const showConfirm = () => {
    return (
      <div className="bg-teal-100 py-2 px-2 text-teal-700 w-full my-3 max-w-sm text-center mx-auto border border-teal-400 rounded">
        <p>{messageConfirm}</p>
      </div>
    )
  }

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="inline-block text-2xl text-gray-800 justify-center">Nou Producte</h1>
        <button
          type="button"
          className="inline-block bg-red-700 opacity-75 w-full sm:w-auto uppercase text-sm rounded px-2 text-white hover:opacity-100"
          onClick={() => cancelProduct()}
        >Cancelar Producte
        </button>
      </div>
      {messageError && showError()}
      {messageConfirm && showConfirm()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}>
            <div>
              <label className="block text-gray-700 test-sm font-bold mb-2" htmlFor="name">
                Nom
              </label>
              <input
                className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Nom"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                <p>{formik.errors.name}</p>
              </div>
            ) : null}
            <div>
              <label className="block text-gray-700 test-sm font-bold mb-2" htmlFor="stock">
                Stock
              </label>
              <input
                className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="stock"
                type="number"
                placeholder="stock"
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.stock && formik.errors.stock ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                <p>{formik.errors.stock}</p>
              </div>
            ) : null}
            <div>
              <label className="block text-gray-700 test-sm font-bold mb-2" htmlFor="price">
                Preu
              </label>
              <input
                className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                type="number"
                placeholder="preu"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.price && formik.errors.price ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                <p>{formik.errors.price}</p>
              </div>
            ) : null}
            <div className="flex justify-center">
              <input
                type="submit"
                className="md:w-1/2 bg-gray-700 mt-5 p-2 text-white uppercase hover:bg-gray-900 rounded"
                value="Crear nou producte"
              />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
export default NouProducte