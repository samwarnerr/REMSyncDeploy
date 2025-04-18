import React from 'react'
import logo from '../../assets/REMSync-logo.png'
import hamburger from '../../assets/hamburger.png'
import profile from '../../assets/icons/profile.svg'
import logout from '../../assets/icons/logout.svg'
import cloud from '../../assets/icons/cloudlogo.svg'
import { Link, useLocation } from 'react-router-dom'

import './navbar.css'

const navbar = ( { onLogout }) => {
  const [menuOpen, setMenuOpen] = React.useState(false)

  const location = useLocation();

  const showLogout = location.pathname === '/dashboard';

  return (
    <>
    <nav className='navbar'>
      <div className='navbar-left'>
        <Link to='/'>
          <img src={logo} alt="REMSync" className='navbar-logo desktop-only' />
          <img src={cloud} className='mobile-logo mobile-only'/>
        </Link>
      </div>
        {showLogout && (
          <div className='navbar-right logout-mobile'>
            <img 
              src={logout}
              alt="Log Out"
              className='profile'
              onClick={onLogout}
              width={30}
              title="Log Out"
            />
          </div>
        )}
    </nav>


    </>
  )
}

export default navbar