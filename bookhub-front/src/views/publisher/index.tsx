import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Publisherpage from './Publisherpage'

function Publisher() {
  return (
  <Routes>
    <Route path="/" element={<Publisherpage/>} />
      
    </Routes>
  )
}

export default Publisher