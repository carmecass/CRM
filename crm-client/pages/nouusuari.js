import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../Components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'

const NEW_USER = gql`
mutation newUser($input: UserInput) {
  newUser(input:$input) {
    id
    name
    surname
    email
  }
}`

const Nouusuari = () => {
  const [newUser] = useMutation(NEW_USER)

  const [messageError, setMessageError] = useState(null)
  const [messageConfirm, setMessageConfirm] = useState(null)

  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nom és obligatori'),
      surname: Yup.string().required('El cognom és obligatori'),
      email: Yup.string().email(`L'email no és vàlid`).required(`L'email és obligatori`),
      password: Yup.string().required('El password és obligatori')
    }),
    onSubmit: async values => {
      const { name, surname, email, password } = values
      try {
        const { data } = await newUser({
          variables: {
            input: {
              name: name,
              surname: surname,
              email: email,
              password: password
            }
          }
        })
        setMessageConfirm(`L'Usuari ${data.newUser.name} ${data.newUser.surname} s'ha creat correctament`)
        setTimeout(() => {
          setMessageConfirm(null)
          router.push('/clients')
        }, 1000)
      } catch (error) {
        setMessageError(error.message.replace('GraphQL error: ', ''))
        setTimeout(() => {
          setMessageError(null)
        }, 3000)
      }
    }
  })

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
      <h1 className="text-center text-2xl text-white">Crear nou usuari</h1>
      {messageError && showError()}
      {messageConfirm && showConfirm()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
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
                onBlur={formik.handleBlur} />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                <p>{formik.errors.name}</p>
              </div>
            ) : null}
            <div>
              <label className="block text-gray-700 test-sm font-bold mb-2" htmlFor="surname">
                Cognom
              </label>
              <input
                className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="surname"
                type="text"
                placeholder="Cognom"
                value={formik.values.surname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} />
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
                onBlur={formik.handleBlur} />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                <p>{formik.errors.email}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} />
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                <p>{formik.errors.password}</p>
              </div>
            ) : null}
            <div className="flex justify-center">
              <input
                type="submit"
                className="md:w-1/2 bg-gray-800 w-full mt-5 p-2 text-white uppercas hover:cursor-pointer hover:bg-gray-900"
                value="Crear nou usuari"
              />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
export default Nouusuari