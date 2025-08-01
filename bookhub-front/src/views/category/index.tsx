import RequireAuth from '@/components/RequireAuth'
import CategoryMain from './CategoryMain'
import { Route } from 'react-router-dom'

function Category() {
  return (
    <>
      <Route
        path="/categories"
        element={
          <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
            <CategoryMain />
          </RequireAuth>
        }
      />
    </>
  )
}

export default Category;