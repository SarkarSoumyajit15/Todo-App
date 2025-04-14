import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { TodoProvider } from "./context/TodoContext";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TodoList from "./components/TodoList";
import TodoDetail from "./components/TodoDetail";
import { Toaster } from "react-hot-toast";

import TagProvider from "./context/TagContext";
import UserProvider from "./context/UserContext";

function App() {
  return (
    <>
      <UserProvider>
        <TagProvider>
          <TodoProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/dashboard"
                    element={
                      <div className="flex flex-col h-screen">
                        <Header />
                        <div className="flex flex-1 overflow-hidden">
                          <Sidebar />
                          <main className="flex-1 overflow-y-auto p-6">
                            <Dashboard />
                          </main>
                        </div>
                      </div>
                    }
                  />

                  <Route
                    path="/todos"
                    element={
                      <div className="flex flex-col h-screen">
                        <Header />
                        <div className="flex flex-1 overflow-hidden">
                          <Sidebar />
                          <main className="flex-1 overflow-y-auto p-6">
                            <TodoList limit={2} showViewAll={false} />
                          </main>
                        </div>
                      </div>
                    }
                  />

                  <Route
                    path="/todos/:id"
                    element={
                      <div className="flex flex-col h-screen">
                        <Header />
                        <div className="flex flex-1 overflow-hidden">
                          <Sidebar />
                          <main className="flex-1 overflow-y-auto p-6">
                            <TodoDetail />
                          </main>
                        </div>
                      </div>
                    }
                  />
                </Route>

                {/* Redirect root to dashboard if logged in, otherwise to login */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />

                {/* Catch all route - redirect to dashboard or login */}
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </Router>
          </TodoProvider>
        </TagProvider>
      </UserProvider>

      <Toaster
        position="top-center"
        toastOptions={{
          // Default toast options
          duration: 2000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          // Custom toast types
          success: {
            duration: 2000,
            style: {
              background: "#22c55e",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ef4444",
            },
          },
        }}
      />
    </>
  );
}

export default App;
