

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import StockLogPage from './StockLogPage'

function StockLog() {
  return (
    <Routes>
      <Route path = "/" element={<StockLogPage />}/>
    </Routes>
  )
}

export default StockLog