import React, { useState } from 'react'
import Layout from '../Components/Layout'
import { gql, useMutation } from '@apollo/client'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/router'

const NEW_CLIENT = gql`
mutation newClient($input: ClientInput) {
  newClient(input:$input) {
    id
    name
    surname
    company
    email
    phone
    salesman
  }
}`;

const GET_CLIENTS_BY_USER = gql`
query getClientsBySalesman{
  getClientsBySalesman{
    id
    name
    surname
    company
    email
  }
}`

const NouClient = () => {
  const router = useRouter()

  const [messageError, setMessageError] = useState(null)
  const [messageConfirm, setMessageConfirm] = useState(null)

  const [newClient] = useMutation(NEW_CLIENT, {
    update(cache, { data: { newClient } }) {
      const { getClientsBySalesman } = cache.readQuery({ query: GET_CLIENTS_BY_USER })
      cache.writeQuery({
        query: GET_CLIENTS_BY_USER,
        data: {
          getClientsBySalesman: [newClient, ...getClientsBySalesman]
        }
      })
    }
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      company: '',
      email: '',
      phone: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nom és obligatori'),
      surname: Yup.string().required('El cognom és obligatori'),
      company: Yup.string().required(`L'empresa és obligatoria`),
      email: Yup.string().email(`L'email no és vàlid`).required(`L'email és obligatori`),
    }),
    onSubmit: async values => {
      const { name, surname, company, email, phone } = values
      try {
        const { data } = await newClient({
          variables: {
            input: {
              name,
              surname,
              company,
              email,
              phone
            }
          }
        })
        setMessageConfirm(`El client ${data.newClient.company} s'ha creat correctament`)
        setTimeout(() => {
          setMessageConfirm(null)
          router.push('/clients')
        }, 2000)
      } catch (error) {
        setMessageError(error.message.replace('GraphQL error: ', ''))
        setTimeout(() => {
          setMessageError(null)
        }, 2000)
      }

    }
  })

  const cancelClient = () => {
    return router.push('/clients')
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
        <h1 className="inline-block text-2xl text-gray-800 justify-center">Nou Client</h1>
        <button
          type="button"
          className="inline-block bg-red-700 opacity-75 w-full sm:w-auto uppercase text-sm rounded px-2 text-white hover:opacity-100"
          onClick={() => cancelClient()}
        >Cancelar Client
        </button>
      </div>
      {messageError && showError()}
      {messageConfirm && showConfirm()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}>
            <div>
              <label className="block text-gray-700 test-sm font-bold mb-2" htmlFor="company">
                Empresa
              </label>
              <input
                className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="company"
                type="text"
                placeholder="Empresa"
                value={formik.values.company}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.company && formik.errors.company ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                <p>{formik.errors.company}</p>
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
              <label className="block text-gray-700 test-sm font-bold mb-2" htmlFor="surname">
                Cognom contacte
              </label>
              <input
                className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="surname"
                type="text"
                placeholder="Cognom"
                value={formik.values.surname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.surname && formik.errors.surname ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                <p>{formik.errors.surname}</p>
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
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                <p>{formik.errors.email}</p>
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
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.phone && formik.errors.phone ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                <p>{formik.errors.phone}</p>
              </div>
            ) : null}
            <div className="flex justify-center">
              <input
                type="submit"
                className="md:w-1/2 bg-gray-700 mt-5 p-2 text-white uppercase hover:bg-gray-900 rounded"
                value="Crear nou client"
              />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
export default NouClient