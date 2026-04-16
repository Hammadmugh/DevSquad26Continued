import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Homepage from './pages/Homepage'
import MoviesShowsPage from './pages/MoviesShowsPage'
import MovieDetailPage from './pages/MovieDetailPage'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import SubscriptionsPage from './pages/SubscriptionsPage'
import PaymentPage from './pages/PaymentPage'
import Footer from './components/Footer'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route
          path="/*"
          element={
            <div className='lg:max-w-[1920px] md:max-w-[1440px] max-w-[390px] mx-auto'>
              <Navbar/>
              <Routes>
                <Route path="/" element={<Homepage/>} />
                <Route path="/movies-shows" element={<MoviesShowsPage/>} />
                <Route path="/movie/:movieId" element={<MovieDetailPage/>} />
                <Route path="/subscriptions" element={<SubscriptionsPage/>} />
                <Route path="/payment/:planId" element={<PaymentPage/>} />
              </Routes>
              <Footer/>
            </div>
          }
        />
        
        {/* Auth Routes - No Navbar/Footer */}
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App