import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Sidebar = () => {
  const router = useRouter()

  return (
    <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5 ">
      <div>
        <p className="text-white text-2xl font-weigth">CRM-Clients</p>
      </div>
      <nav className="mt-3 list-none">
        <li className={router.pathname === "/clients" ? "text-white block bg-blue-800 p-2" : "text-white block p-2 hover:bg-indigo-800"}>
          <Link href="/clients">
            <a>Clients</a>
          </Link>
        </li>
        <li className={router.pathname === "/comandes" ? "text-white block bg-blue-800 p-2" : "text-white block p-2 hover:bg-indigo-800"}>
          <Link href="/comandes">
            <a>Comandes</a>
          </Link>
        </li>
        <li className={router.pathname === "/productes" ? "text-white block bg-blue-800 p-2" : "text-white block p-2 hover:bg-indigo-800"}>
          <Link href="/productes">
            <a>Productes</a>
          </Link>
        </li>
        <div className="sm:mt-10">
          <p className="text-white text-2xl font-weigth">Ranking</p>
        </div>
        <nav className="mt-3 list-none">
          <li className={router.pathname === "/topclients" ? "text-white block bg-blue-800 p-2" : "text-white block p-2 hover:bg-indigo-800"}>
            <Link href="/topclients">
              <a>Top Clients</a>
            </Link>
          </li>
          <li className={router.pathname === "/topvenedors" ? "text-white block bg-blue-800 p-2" : "text-white block p-2 hover:bg-indigo-800"}>
            <Link href="/topvenedors">
              <a>Top Venedors</a>
            </Link>
          </li>
        </nav>
      </nav>
    </aside>
  )
}
export default Sidebar