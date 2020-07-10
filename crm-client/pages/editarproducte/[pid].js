import React from 'react'
import Layout from '../../Components/Layout'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

const GET_PRODUCT = gql`
query getProduct($id: ID!) {
  getProduct(id: $id){
    id
    name
    stock
    price
  }
}`

const UPDATE_PRODUCT = gql`
mutation updateProduct($id: ID!, $input: ProductInput) {
  updateProduct(id:$id, input: $input) {
    id	
    name
    price
    stock
    date_creation
  }
}`

const EditarProducte = () => {
  const router = useRouter()
  const { query: { id } } = router
  const { data=[], loading, error } = useQuery(GET_PRODUCT, {
    variables: {
      id
    }
  })
  const [updateProduct] = useMutation(UPDATE_PRODUCT)

  const schemaValidation = Yup.object({
    name: Yup.string().required('El nom és obligatori'),
    stock: Yup.number()
      .required('El stock és obligatori')
      .positive(`No s'admeten números negatius`)
      .integer('El stock ha de ser un número enter'),
    price: Yup.number()
      .required('El preu és obligatori')
      .positive(`No s'admeten números negatius`)
  })
  if (!id) loading
  if (loading) return <p className="my-2 bg-blue-100 border-l-4 border-blue-700 p-4 text-center">Carregant...</p>
  if (!data) return 'Acció no permesa'

  const { getProduct } = data

  const updateInfoProduct = async values => {
    const { name, stock, price } = values
    try {
      await updateProduct({
        variables: {
          id,
          input: {
            name,
            stock,
            price
          }
        }
      })
      Swal.fire(`El product ${name} s'ha actualitzat correctament`)
      router.push('/productes')
    } catch (error) {
      console.log(error);
    }
  }

  const cancelProduct = () => {
    return router.push('/productes')
  }

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="inline-block text-2xl text-gray-800 justify-center">Editar Producte</h1>
        <button
          type="button"
          className="inline-block bg-red-700 opacity-75 w-full sm:w-auto uppercase text-sm rounded px-2 text-white hover:opacity-100"
          onClick={() => cancelProduct()}
        >Cancelar Producte
        </button>
      </div>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            validationSchema={schemaValidation}
            enableReinitialize
            initialValues={getProduct}
            onSubmit={(values) => { updateInfoProduct(values) }}
          >
            {props => (
              <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                onSubmit={props.handleSubmit}>
                <div>
                  <label className="block text-gray-700 test-sm font-bold mb-2" htmlFor="name">
                    Nom
                </label>
                  <input
                    className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    placeholder="Nom"
                    value={props.values.name}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                </div>
                {props.touched.name && props.errors.name ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                    <p>{props.errors.name}</p>
                  </div>
                ) : null}
                <div>
                  <label className="block text-gray-700 test-sm font-bold mt-2 mb-2" htmlFor="stock">
                    Stock
                  </label>
                  <input
                    className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="stock"
                    type="number"
                    placeholder="Stock"
                    value={props.values.stock}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                </div>
                {props.touched.stock && props.errors.stock ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                    <p>{props.errors.stock}</p>
                  </div>
                ) : null}
                <div>
                  <label className="block text-gray-700 test-sm font-bold mt-2 mb-2" htmlFor="price">
                    Preu
                </label>
                  <input
                    className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="price"
                    type="number"
                    placeholder="Preu"
                    value={props.values.price}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                </div>
                {props.touched.price && props.errors.price ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                    <p>{props.errors.price}</p>
                  </div>
                ) : null}
                <div className="flex justify-center">
                  <input
                    type="submit"
                    className="md:w-1/2 bg-gray-700 mt-5 p-2 text-white uppercase hover:bg-gray-900 rounded"
                    value="Guardar producte"
                  />
                </div>
              </form>
            )
            }
          </Formik>
        </div>
      </div>

    </Layout>
  )
}
export default EditarProducte