import React, { useEffect } from 'react'
import Layout from '../Components/Layout'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { gql, useQuery } from '@apollo/client'

const GET_BEST_CLIENTS = gql`
query getBestClients{
  getBestClients{
   client {
    name
    company
  }
    total
  }
}`

const TopClients = () => {
  const { data, loading, error, startPolling, stopPolling } = useQuery(GET_BEST_CLIENTS)

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling()
    }
  }, [startPolling, stopPolling])

  if (loading) return <p className="my-2 bg-blue-100 border-l-4 border-blue-700 p-4 text-center">Carregant...</p>

  const { getBestClients } = data
  
  const clientsChart = []
  getBestClients.map((client, i) => {
    clientsChart[i] = {
      ...client.client[0],
      total: client.total
    }
  })

  return (
    <Layout>
      <h1 className="inline-block text-2xl text-gray-800 justify-center">Top Clients</h1>
      <ResponsiveContainer
        width={'90%'}
        height={450}
      >
        <BarChart
          className="mt-10"
          width={600}
          height={400}
          data={clientsChart}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="company" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </Layout>
  )
}
export default TopClients