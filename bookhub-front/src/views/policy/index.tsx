import React from 'react'
import { Route, Routes } from 'react-router-dom'
import PolicySearch from './PolicySearch'


function Policy() {
  return (
    <Routes>
    <Route path="/" element={<PolicySearch />} />
      {/* <Route
        path="/admin"
        element={
          <RequireAuth allowedRoles={["ADMIN"]}>
            <PolicyPage />
          </RequireAuth>
        }
      /> */}
    </Routes>
  )
}

export default Policy