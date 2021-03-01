import React from 'react'

const Notification = ({ message, messageType }) => {
  if (message === null || messageType === null) {
    return null
  }

  return (
    <div className={messageType}>
      {message}
    </div>
  )
}

export default Notification