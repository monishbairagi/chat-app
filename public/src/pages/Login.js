import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-center",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    const userData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    if (userData) {
      if (userData.isAvatarImageSet) {
        navigate("/login");
      } else {
        navigate("/edit-profile");
      }
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Username or email is required", toastOptions);
    } if (password === "") {
      toast.error("Password is required", toastOptions);
    }
    return (username !== "" && password !== "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      } else {
        localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>ChatUp</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Login</button>
          <span>
            Don't have an account? <Link to="/register">Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background: linear-gradient(35deg, rgba(96,0,0,1) 10%, rgba(120,9,121,1) 60%, rgba(0,47,116,1) 100%);
  .brand {
    display: flex;
    align-items: center;
    gap: .5rem;
    justify-content: center;
    img {
      height: 2.5rem;
    }
    h1 {
      color: white;
      
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.8);
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #d400d4;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #ff00ff;
      outline: none;
    }
  }
  button {
    background-color: #d400d4;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    
    &:hover {
      background-color: #ff00ff;
    }
  }
  span {
    color: white;
    align-self: center;
    a {
      color: #ff00ff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;