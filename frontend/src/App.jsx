import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Cart from './pages/Cart'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Order from './pages/Order'
import PlaceOrder from './pages/PlaceOrder'
import Product from './pages/Product'
import Training from './pages/Training'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  
  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);
  
  const handleAnimationEnd = () => {
    if (transitionStage === "fadeOut") {
      setTransitionStage("fadeIn");
      setDisplayLocation(location);
      // Scroll to the top when navigating to a new page
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <div 
        className={`page-transition ${transitionStage}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <Routes location={displayLocation}>
        <Route path='/' element={<Home />}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Cart' element={<Cart/>}/>
        <Route path='/Collection' element={<Collection/>}/>
        <Route path='/Contact' element={<Contact/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Order' element={<Order/>}/>
        <Route path='/PlaceOrder' element={<PlaceOrder/>}/>
        <Route path='/Product/:ProductId' element={<Product/>}/>
        <Route path='/Training' element={<Training/>}/>
      </Routes>
      </div>
      <Footer/>
    </div>
  )
}

export default App