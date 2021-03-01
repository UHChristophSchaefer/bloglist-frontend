import React, { useState } from 'react'

const Blog = ({ blog, addLike, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showDetailedView, setShowDetailedView] = useState(false)

  if(showDetailedView){
    return (
      <div style={blogStyle} className="blog">
        {blog.title} {blog.author}
        <button onClick={() => setShowDetailedView(false)}>
        hide
        </button>
        <div>
          {blog.url}
        </div>
        <div className="likeDiv">
          likes: {blog.likes}
          <button onClick={() => addLike(blog)}>
            like
          </button>
        </div>
        <div>
          { blog.user.name }
        </div>
        <button onClick={() => deleteBlog(blog)}>
          delete
        </button>
      </div>
    )
  }
  else {
    return (
      <div style={blogStyle} className="blog">
        {blog.title} {blog.author}
        <button onClick={() => setShowDetailedView(true)}>
        view
        </button>
      </div>
    )
  }
}

export default Blog