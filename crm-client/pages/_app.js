import { ApolloProvider } from '@apollo/client'
import client from '../config/apollo'
import StateOrder from '../Context/Orders/StateOrder'
import '../styles.css'

const MyApp = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <StateOrder>
        <Component {...pageProps} />
      </StateOrder>
    </ApolloProvider>
  )
}
export default MyApp