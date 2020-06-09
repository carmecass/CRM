import React from 'react'
import Head from 'next/head'
import Sidebar from '../Components/Sidebar'
import Header from '../Components/Header'
import { useRouter } from 'next/router'

const Layout = ({ children }) => {

  const router = useRouter()
  return (
    <>
      <Head>
        <title>CRM</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU=" crossOrigin="anonymous" />
        <link rel="shortcut icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAADdElEQVRYhcWWT2wUdRTHv+/NH3Z2h+m4dLfrKkULbT3QWlGTXlBjiDWGiwcjqQdjYkg8ePFiYjxpjBdJ5K7GRC8YExMvRioYLXhpxZUIImJialkryHYWd4fp7Px+zwNSKYfunwntu73fvPd9n3lvfr/fACnMOZi1rWl7PI0Gp0mWWEoJksk0GmaaZGUqD0XKptFI1QHeb3q0jzNpNFJ1AK54AHJpJFJ1QEF7EGzeCADxDTbqaRRSjUAIrogO02h01QHzOWv6Zp8Ak6uUpn53ABry6JoFRVq+0RsD8MgHj7FAdq9Z/FUYKym3cqeBtXoN8FDe+fnI6r6XHwSQ6yOgZ7gnkI6TLi5Xbd7NtSWn6q8mR6QJ0ADAFh+4rQDysM7TLr4QUZwHgO1v72ARgRbNe159kAUydVsBrmWjMhk4BxL/8dl97JjOjUc6aq1AgInhQ6Ndj6Hjc0CLKhPojAj8E42T+21lVkQEBOLF8A+QR359MMgCaHQD0DGxjnXJgnWWQfnkp9ZIdDqaFAiISPf1+y524Xz9jquDW2Yy0xPHHupYd93A/CvbOPOCM3TdI78oAwuixedzZBPoAQJHSnQSlJb7jVHjlIIeiil56bz6eTD3ojv0xBtPtgVZNyBYCvZE0coMvWy8DkvudxO3wcwZRKQJ5EEkBCRuFZIiO/wjASOGGAsraL0VtsLZE7/MDqYCICIbQIYKdBcIczZZgAAMYiUqJKJACBEJlQAsCDDFxB9xk5YkRgbSfsTrfoROX3b+WiN8urSjfFpENBEBlwAR0QyeE8FVnmA78VXZhHGhhcTdhvx3uUX3+F9G9cho6b7fT+H73gFMy9R9Rb9y8fmFGAAGvigyHYUtQNgv/ceTfxJenqhPEmPMFLOmoN4/MPBso/lbE5VCpTL/zlzbi2JdgOBwLbnZv0fuxVl15k4t+uTe8b1Bs9XUM3ws1FDlu2l7kFO5jw+Pv3ujaNyueFuAW+2zpz7VxrTlM9HiJ68dSQDA/soJCZwvqEJ0Jb7SjVz3AAAgkMCmLdXWfy/I4FAhyXw79XVP93LXRycLXfayXvV/AQoF0vOfcdcAOTP34VhpbHW+ppihgrY3DGC4OFw9+uaXq+12kIkIFGwYwPyhuTU7A5ojCGobBnCrFVGMSejvTQPYKlsTYvy5aQCJSuAmufd6zf8XUz1VUNZSaJgAAAAASUVORK5CYII=" />
      </Head>

      {(router.pathname === '/' || router.pathname === '/nouusuari') ? (
        <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
          <div>
            {children}
          </div>
        </div>
      ) : (
          <div className="bg-gray-200 min-h-screen">
            <div className="sm:flex min-h-screen">
              <Sidebar />
              <main className="sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5 ">
                <Header />
                {children}
              </main>
            </div>
          </div>
        )
      }
    </>
  )
}
export default Layout