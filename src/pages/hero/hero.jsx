import React from 'react'
import { Navbar } from '../../components'
import { useNavigate } from 'react-router-dom'
import './hero.css'

const hero = () => {

  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/dashboard')
  }

  return (
    <div>
        <Navbar />
        <div className='hero-container'>
            <h1 className='hero-title'>Improve Your Sleep Quality</h1>
            <p className='hero-ptext'>Track your sleep patterns and get personalized insights to build better sleep habits.</p>
            <button className='hero-button' onClick={handleClick}>Get Started</button>
            <div>
            </div>
        </div>
    </div>
  )
}

export default hero