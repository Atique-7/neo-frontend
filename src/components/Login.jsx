// src/components/Login.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tokenUrl = 'http://localhost:8000/api/token/';
    try {
      const response = await axios.post(tokenUrl, {
        username,
        password,
      });

      dispatch(setCredentials({ user: username, token: response.data.access }));
      navigate('/');
    } catch (error) {
      console.error('Login Error:', error);
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
