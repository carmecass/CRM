import React from 'react'
import { gql, useQuery, ApolloConsumer } from '@apollo/client'
import { useRouter } from 'next/router'
import client from '../config/apollo';

const GET_USER = gql`
query getUser {
  getUser{
    name
    surname
  }
}`;

const Header = () => {
  const router = useRouter()

  const { data, loading, error } = useQuery(GET_USER)

  if (loading) return <p className="my-2 bg-blue-100 border-l-4 border-blue-700 p-4 text-center">Carregant...</p>

  if (!data) return router.push('/')

  const { name, surname } = data.getUser

  const logOut = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (<>
    <div className="sm:flex sm:justify-between mb-4">
      <p className="mr-4 mb-5 lg:mb-0">Hola: {name} {surname}</p>
      <button
        onClick={() => logOut()}
        className="bg-blue-800 w-full sm:w-auto uppercase text-sm rounded py-2 px-2 text-white hover:bg-gray-800"
        type="button">Tancar sessió</button>
    </div>
  </>)
  }
export default Header