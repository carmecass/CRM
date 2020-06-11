import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../Components/Layout'
import { Formik, } from 'formik'
import { useQuery, gql, useMutation } from '@apollo/client'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

const GET_CLIENT = gql`
  query getClient($id: ID!) {
    getClient(id:$id) {
    name
    surname
    company
    email
    phone
  }
 }`;

const UPDATE_CLIENT = gql`
 mutation updateClient($id: ID!, $input: ClientInput) {
  updateClient(id:$id, input: $input) {
    id
    name	
    surname
    company
    email
    phone
  }
}`

const EditarClient = () => {
  const router = useRouter()

  const { query: { id } } = router

  const { data, loading, error } = useQuery(GET_CLIENT, {
    variables: {
      id
    }
  })

  const [updateClient] = useMutation(UPDATE_CLIENT)

  const schemaValidation = Yup.object({
    name: Yup.string().required('El nom és obligatori'),
    surname: Yup.string().required('El cognom és obligatori'),
    company: Yup.string().required(`L'empresa és obligatoria`),
    email: Yup.string().email(`L'email no és vàlid`).required(`L'email és obligatori`)
  });

  if (loading) return <p className="my-2 bg-blue-100 border-l-4 border-blue-700 p-4 text-center">Carregant...</p>
  const { getClient } = data

  const updateInfoClient = async values => {
    const { name, surname, company, email, phone } = values;
    try {
      const { data } = await updateClient({
        variables: {
          id,
          input: {
            name,
            surname,
            company,
            email,
            phone
          }
        }
      })
      Swal.fire(`El client ${name} ${surname} s'ha actualitzat correctament`)
      router.push('/clients')
    } catch (error) {
      console.log(error);
    }
  }

  const cancelClient = () => {
    return router.push('/clients')
  }

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="inline-block text-2xl text-gray-800 justify-center">Editar Client</h1>
        <button
          type="button"
          className="inline-block bg-red-700 opacity-75 w-full sm:w-auto uppercase text-sm rounded px-2 text-white hover:opacity-100"
          onClick={() => cancelClient()}
        >Cancelar Client
        </button>
      </div>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            validationSchema={schemaValidation}
            enableReinitialize
            initialValues={getClient}
            onSubmit={(values) => {
              updateInfoClient(values);
            }}
          >
            {props => {
              return (
                <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}
                >
                  <div>
                    <label className="block text-gray-700 test-sm font-bold mb-2" htmlFor="company">
                      Empresa
                    </label>
                    <input
                      className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="company"
                      type="text"
                      placeholder="Empresa"
                      value={props.values.company}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.company && props.errors.company ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                      <p>{props.errors.company}</p>
                    </div>
                  ) : null}
                  <div>
                    <label className="block text-gray-700 test-sm font-bold mb-2" htmlFor="name">
                      Nom contacte
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
                    <label className="block text-gray-700 test-sm font-bold mb-2" htmlFor="surname">
                      Cognom contacte
                    </label>
                    <input
                      className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="surname"
                      type="text"
                      placeholder="Cognom"
                      value={props.values.surname}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.surname && props.errors.surname ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                      <p>{props.errors.surname}</p>
                    </div>
                  ) : null}
                  <div>
                    <label className="block text-gray-700 test-sm font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={props.values.email}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.email && props.errors.email ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                      <p>{props.errors.email}</p>
                    </div>
                  ) : null}
                  <div>
                    <label className="block text-gray-700 test-sm font-bold mb-2" htmlFor="phone">
                      Telèfon
                    </label>
                    <input
                      className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="phone"
                      type="tel"
                      placeholder="Telèfon"
                      value={props.values.phone}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.phone && props.errors.phone ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                      <p>{props.errors.phone}</p>
                    </div>
                  ) : null}
                  <div className="flex justify-center">
                    <input
                      type="submit"
                      className="md:w-1/2 bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 rounded"
                      value="Guardar client"
                    />
                  </div>
                </form>
              )
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}
export default EditarClient