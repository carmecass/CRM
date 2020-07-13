import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Layout from '../Components/Layout'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'

const USER_AUTHENTICATE = gql`
mutation userAuthenticate($input: AuthenticateInput) {
  userAuthenticate(input: $input) {
    token
  }
}`

const Login = () => {
  const router = useRouter()
  const [messageError, setMessageError] = useState(null)
  const [messageConfirm, setMessageConfirm] = useState(null)

  const [userAuthenticate] = useMutation(USER_AUTHENTICATE)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().required(`L'email no és vàlid`).required(`L'email és obligatori`),
      password: Yup.string().required('El password és obligatori').min(6, 'El password ha de tenir mínim 6 caràcters'),
    }),
    onSubmit: async values => {
      const { email, password } = values

      try {
        const { data } = await userAuthenticate({
          variables: {
            input: {
              email,
              password
            }
          }
        })
        setMessageConfirm('Autenticant... ')
        setTimeout(() => {
          const { token } = data.userAuthenticate
          localStorage.setItem('token', token)
        }, 2000);

        setTimeout(() => {
          setMessageConfirm(null)
          router.push('/clients')
        }, 2100);

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
    <>
      <Layout>
        <h1 className="text-center text-2xl text-white">Login</h1>
        {messageError && showError()}
        {messageConfirm && showConfirm()}
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}>
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
                  className="md:w-1/2 bg-gray-800 w-full mt-5 p-2 text-white uppercas rounded cursor-pointer hover:bg-gray-900"
                  value="Iniciar Sessió"
                />
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  )
}
export default Login