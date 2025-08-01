import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEmployeeStore } from "./stores/employee.store";
import Sidebar from "./layouts/sidebar";
import Header from "./layouts/header";
import SignUp from "./views/auth/SignUp";
import SignIn from "./views/auth/SignIn";
import SearchBranch from "./views/branch/SearchBranch";
import RequireAuth from "./components/RequireAuth";
import CreateBranch from "./views/branch/CreateBranch";
import LoginIdFindEmail from "./views/auth/LoginIdFindEmail";
import LoginIdGet from "./views/auth/LoginIdGet";
import PasswordChangeSendEmail from "./views/auth/PasswordChangeSendEmail";
import PasswordChange from "./views/auth/PasswordChange";
import Author from "./views/author/Author";
import CreateAuthor from "./views/author/CreateAuthor";
import Publisher from "./views/publisher";
import Policy from "./views/policy";
import StockLog from "./views/stock-logs";
import LocationPage from "./views/location/LocationPage";
import MainPage from "./views/main/MainPage";
import ReceptionConfirm from "./views/reception/ReceptionConfirm";
import ReceptionPending from "./views/reception/ReceptionPending";
import SearchBook from "./views/book/SearchBook";
import AlertPage from "./views/alert/AlertPage";
import CategoryMain from "./views/category/CategoryMain";
import EmployeeSearch from "./views/employee/EmployeeSearch";
import EmployeeChange from "./views/employee/EmployeeChange";
import EmployeeSignUpApprovals from "./views/employee/EmployeeSignUpApprovals";
import SignUpInfoUpdate from "./views/auth/SignUpInfoUpdate";
import EmployeeSignUpApprovalsSearch from "./views/employee/EmployeeSignUpApprovalsSearch";
import EmployeeExitLog from "./views/employee/EmployeeExitLog";
import EmployeeChangeLog from "./views/employee/EmployeeChangeLog";

import BranchStockStatistics from "./views/statistics/stockStatistics/BranchStockStatistics";
import CategoryStockStatistics from "./views/statistics/stockStatistics/CategoryStockStatistics";
import TimeStockStatistics from "./views/statistics/stockStatistics/TimeStockStatistics";
import ZeroStockStatistics from "./views/statistics/stockStatistics/ZeroStockStatistics";
import BookLogs from "./views/book/book-logs/BookLogs";
import AdminReceptionList from "./views/reception/AdminReceptionList";
import Book from "./views/book/AdminBook";
import AdminBook from "./views/book/AdminBook";
import ElsePurchaseOrderApproval from "./views/purchaseOrder/purchaseOrderApproval/ElsePurchaseOrderApproval";
import ElsePurchaseOrder from "./views/purchaseOrder/ElsePurchaseOrder";
import ApprovePurchaseOrder from "./views/purchaseOrder/purchaseOrderApproval/ApprovePurchaseOrder";

function App() {
  const isLogin = useEmployeeStore((state) => state.isLogin);
  if (!isLogin) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" />} />
        <Route path="/auth/login" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route
          path="/auth/login-id-find/email"
          element={<LoginIdFindEmail />}
        />
        <Route path="/auth/login-id-find" element={<LoginIdGet />} />
        <Route
          path="/auth/password-change/email"
          element={<PasswordChangeSendEmail />}
        />
        <Route path="/auth/password-change" element={<PasswordChange />} />
        <Route path="/auth/sign-up/update" element={<SignUpInfoUpdate />} />
      </Routes>
    );
  }

  return (
    <>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          border: "none",
        }}
      >
        <Header />
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          <Sidebar />
          <main
            style={{
              flex: 1,
              padding: "30px",
              minWidth: "1500px",
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/main" />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/alerts/*" element={<AlertPage />} />
              <Route path="/books/search/*" element={<SearchBook />} />
              <Route path="/book/edit" element={<AdminBook />} />
              <Route path="/booklogs/*" element={<BookLogs />} />
              <Route path="/author/else" element={<Author />} />
              <Route path="/publishers/*" element={<Publisher />} />
              <Route path="/policies/*" element={<Policy />} />
              <Route path="/locations" element={<LocationPage />} />
              <Route path="/purchase-order" element={<ElsePurchaseOrder />}/> 
              <Route path="/purchase-order/approve" element={<ApprovePurchaseOrder />}/> 
              <Route path="/purchase-order-approval" element={<ElsePurchaseOrderApproval /> } />
              {/* <Route path="/author/else" element={<ElseAuthor />} /> */}
              {/* <Route path="/best-seller" element={<TotalBestSeller />} /> */}
              {/* <Route path="/best-seller/period" element={<BestSellerByPeriod />} /> */}
              {/* <Route path="/best-seller/category" element={<BestSellerByCategory />} /> */}
              <Route path="/stock-logs/*" element={<StockLog />} />
              {/* <Route path="/statistics/stocks/*" element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <StockStatistics />
                </RequireAuth>
              }
              /> */}
              <Route
                path="/author/create"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <CreateAuthor />
                  </RequireAuth>
                }
              />
              ƒ
              <Route
                path="/branches"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <SearchBranch />
                  </RequireAuth>
                }
              />
              <Route
                path="/branches/manage"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <CreateBranch />
                  </RequireAuth>
                }
              />
              <Route
                path="/categories"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <CategoryMain />
                  </RequireAuth>
                }
              />
              <Route
                path="/reception/confirmed"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <ReceptionConfirm />
                  </RequireAuth>
                }
              />
              <Route
                path="/reception/pending"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <ReceptionPending />
                  </RequireAuth>
                }
              />
              <Route path="/reception/logs" element={
                <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                  <AdminReceptionList />
                </RequireAuth>
              }
              />
              {/* <Route path="/author/create" element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <CreateAuthor />
                </RequireAuth>
              }
              /> */}

              <Route
                path="/statistics/stocks/time"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <TimeStockStatistics />
                  </RequireAuth>
                }
              />
              <Route
                path="/statistics/stocks/category"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <CategoryStockStatistics />
                  </RequireAuth>
                }
              />
              <Route
                path="/statistics/stocks/branch"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <BranchStockStatistics />
                  </RequireAuth>
                }
              />
              <Route
                path="/statistics/stocks/zero"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <ZeroStockStatistics />
                  </RequireAuth>
                }
              />
              {/* <Route path="/statistics/sales-quantity/branch" element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <SaleQuantityByBranch />
                </RequireAuth>
              }
              /> */}
              {/* <Route path="/statistics/sales-quantity/period" element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <SalesQuantityByPeriod />
                </RequireAuth>
              }
              /> */}
              {/* <Route path="/statistics/sales-quantity/discount-policy" element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <SalesQuantityByDiscountPolicy />
                </RequireAuth>
              }
              /> */}
              {/* <Route path="/statistics/sales-quantity/category" element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <SalesQuantityByCategory />
                </RequireAuth>
              }
              /> */}
              <Route
                path="/employees"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <EmployeeSearch />
                  </RequireAuth>
                }
              />
              <Route
                path="/employees/approval"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <EmployeeSignUpApprovals />
                  </RequireAuth>
                }
              />
              <Route
                path="/employees/edit"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <EmployeeChange />
                  </RequireAuth>
                }
              />
              <Route
                path="/employees/approval/logs"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <EmployeeSignUpApprovalsSearch />
                  </RequireAuth>
                }
              />
              <Route
                path="/employees/logs"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <EmployeeChangeLog />
                  </RequireAuth>
                }
              />
              <Route
                path="/employees/retired/logs"
                element={
                  <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
                    <EmployeeExitLog />
                  </RequireAuth>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
