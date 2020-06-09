import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import {gql, useQuery} from '@apollo/client'
import ContextOrder from '../../Context/Orders/ContextOrder'

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

const AssignClient = () => {
  const [client, setClient] = useState([])
  const contextOrder = useContext(ContextOrder)
  const {addClient} = contextOrder

  const {data, loading, error} = useQuery(GET_CLIENTS_BY_USER)

  useEffect(() => {
    addClient(client)
  }, [client])

  const selecClient = clients => {
    setClient(clients)
  }

  if (loading) return null
  const {getClientsBySalesman} = data
  return (<>
    <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm">Assigna un client a la comanda</p>

    <Select
      className="mt-3"
      options={getClientsBySalesman}
      onChange={opcion => selecClient(opcion)}
      getOptionValue={val => val.id}
      getOptionLabel={lab => `${lab.company}`}
      placeholder="Selecciona el client"
      noOptionsMessage={() => "No hi ha resultats"}
    />
  </>)
}
export default AssignClient