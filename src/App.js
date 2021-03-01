import React, { useState, useEffect, useRef  } from 'react'


// components
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

// services
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      // console.log(window.localStorage)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setMessageType('info')
      setMessage('Successfully logged in.')
      setTimeout(() => {
        setMessageType(null)
        setMessage(null)
      }, 5000)

    } catch (exception) {
      setMessageType('error')
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessageType(null)
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)

    setMessageType('info')
    setMessage('Successfully logged out.')
    setTimeout(() => {
      setMessageType(null)
      setMessage(null)
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const createdBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(createdBlog))

      setMessageType('info')
      setMessage(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      setTimeout(() => {
        setMessageType(null)
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessageType('error')
      setMessage('new Blog could no been created.')
      setTimeout(() => {
        setMessageType(null)
        setMessage(null)
      }, 5000)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog}
      />
    </Togglable>
  )

  const addLike = async (blog) => {
    const newBlog = {
      user:  blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const updatedBlog = await blogService.update(blog.id, newBlog)

    setBlogs(blogs.map((item) => {
      if (item.id === updatedBlog.id) {
        const updatedItem = {
          ...item,
          likes: updatedBlog.likes,
        }
        return updatedItem
      }
      return item
    }))

  }

  const deleteBlog = async (blog) => {
    const res = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if(res){
      const response = await blogService.deleteBlog(blog.id)
      if(response.status === 204){
        setBlogs(blogs.filter((b) => b.id !== blog.id))
      }
    }
  }

  if(user === null){
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} messageType={messageType} />
        <form onSubmit={handleLogin} id="login-form">
          <div>
            username
            <input
              id='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="login-button">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} messageType={messageType} />
      <p>
        {user.name} logged-in
        <button onClick={handleLogout}>
          logout
        </button>
      </p>

      {blogForm()}

      {blogs.sort((a, b) => {
        return b.likes - a.likes}).map(blog =>
        <Blog key={blog.id} blog={blog} addLike={addLike} deleteBlog={deleteBlog}/>
      )}
    </div>
  )
}

export default App