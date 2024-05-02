import { Box } from '@mui/material'
import React from 'react'
import logo from '../Resources/logo.png'
import { useNavigate } from 'react-router-dom'

const Header = () => {

  const navigate = useNavigate()

  return (
    <Box height={10} margin={3} mb={5} onClick={() => navigate("/")}>
        <img src={logo} alt="logo" loading='lazy' width={150}/>
    </Box>
  )
}

export default Header