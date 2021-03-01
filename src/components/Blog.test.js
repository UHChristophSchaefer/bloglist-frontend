import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { render, fireEvent } from '@testing-library/react'

describe('<Blog />', () => {
  let component
  let addLikeMockHandler
  let deleteBlogMockHandler

  beforeEach(() => {
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    const blog = {
      title: 'title',
      author: 'author',
      url: 'www.url.fi',
      likes: 123,
      user: user
    }

    addLikeMockHandler = jest.fn()
    deleteBlogMockHandler = jest.fn()

    component = render(
      <Blog key={blog.id}
        blog={blog}
        addLike={addLikeMockHandler}
        deleteBlog={deleteBlogMockHandler}/>
    )
  })

  test('renders blog´s title and author, but doen not url or number of likes by default', () => {
    expect(component.container).toHaveTextContent(
      'title'
    )

    const div = component.container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'author'
    )
    expect(div).not.toHaveTextContent(
      'www.url.fi'
    )
    expect(div).not.toHaveTextContent(
      '123'
    )
  })

  test('blog´s url and number of likes are shown when the button controlling the shown details has been clicked', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(
      'title'
    )

    const div = component.container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'author'
    )
    expect(div).toHaveTextContent(
      'www.url.fi'
    )
    expect(div).toHaveTextContent(
      '123'
    )
  })

  test('if the like button is clicked twice, the event handler the component received as props is called twice', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)

    fireEvent.click(likeButton)
    expect(addLikeMockHandler.mock.calls).toHaveLength(2)
  })
})

describe('<BlogForm />', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog}/>
  )

  const form = component.container.querySelector('form')

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')

  fireEvent.change(title, {
    target: { value: 'title2' }
  })

  fireEvent.change(author, {
    target: { value: 'author2' }
  })

  fireEvent.change(url, {
    target: { value: 'www.url2.fi' }
  })


  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0].title).toBe('title2')
  expect(createBlog.mock.calls[0][0].author).toBe('author2')
  expect(createBlog.mock.calls[0][0].url).toBe('www.url2.fi')
})