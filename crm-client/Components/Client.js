import React from 'react'
import Swal from 'sweetalert2'
import { gql, useMutation } from '@apollo/client'
import Router from 'next/router'

const DELETE_CLIENT = gql`
mutation deleteClient($id: ID!) {
  deleteClient(id: $id)
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
}`;

const Client = ({ client }) => {
  
  const { id, name, surname, company, email } = client
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    update(cache) {
      const { getClientsBySalesman } = cache.readQuery({ query: GET_CLIENTS_BY_USER })
      cache.writeQuery({
        query: GET_CLIENTS_BY_USER,
        data: {
          getClientsBySalesman: getClientsBySalesman.filter(currentClient => currentClient.id !== id)
        }
      })
    }
  })

  const deleteClientById = (id) => {
    Swal.fire({
      html: `Estàs segur d'eliminar aquest client? <br> Aquesta acció no és pot desfer`,
      showCancelButton: true,
      confirmButtonColor: '#2c5282',
      cancelButtonColor: '#c53030',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then(async (result) => {
      if (result.value) {
        try {
          const { data } = await deleteClient({
            variables: { id: id }
          })
          Swal.fire({
            html: `${data.deleteClient}`,
            confirmButtonColor: '#2c5282',
          })
        } catch (error) {
          console.log(error);
        }
      }
    })
  }

  const editClient = () => {
    Router.push({
      pathname: "/editarclient/[id]",
      query: { id }
    })
  }

  return (
    <tr key={id}>
      <td className="border px-4 py-2">{company}</td>
      <td className="border px-4 py-2">{name} {surname}</td>
      <td className="border px-4 py-2">{email}</td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-red-700 py-2 px-4 w-full text-white rounded text-xs uppercase opacity-75 hover:opacity-100"
          onClick={() => deleteClientById(id)}
        >
          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 ml-2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase opacity-75 hover:opacity-100"
          onClick={() => editClient(id)}
        >
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5 ml-2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        </button>
      </td>
    </tr>
  )
}

export default Client