import React, { Fragment, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode"
import {effect, signal} from "@preact/signals-react"
export var isLoggedIn = signal(false);
var error = signal(" ");
export const axiosJWT = axios.create();
export var user = signal();

const Login = () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(storedUser); // Visszaállítás localStorage-ből
    console.log(user.value);
  }
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const refreshToken = async()=>{
        try{
            const res = await axios.post("http://localhost:3500/refresh", {token: user.value.refreshToken, id: user.value.id})
            return res.data;
        }catch(err){
            console.log(err);
        }
    };


    axiosJWT.interceptors.request.use(
        async (config) =>{
            let currentDate = new Date();
            const decodedToken = jwtDecode(user.value.accessToken);
            if(decodedToken.exp * 1000 < currentDate.getTime()){
                const data = await refreshToken();
                user.value.accessToken = data.accessToken
                user.value.refreshToken = data.refreshToken
                user.value.id = data.id
                config.headers["authorization"] = "Bearer " + user.value.accessToken  
            }
            
            return config;
            }, (error) => {
                console.log(error);
                return Promise.reject(error)
            }
        )
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post("http://localhost:3500/login", { username, password });
          if (res.data && res.data.accessToken) {
            user.value = res.data;
            localStorage.setItem("user", JSON.stringify(user.value)); // Teljes felhasználói objektum mentése
            error.value = " "
            isLoggedIn.value = true;
            navigate("/userprofile");
          } else {
            error.value = "Téves felhasználónév vagy jelszó!";
          }
        } catch (err) {
          console.log(err);
          error.value = "Hiba történt!"
        }
      };

    async function goToRegister(){
        navigate("/register")
    }
    
  return (
    <div className='login-register-container'>
         <div class="form-container">
            <p class="title">Bejelentkezés</p>
            <form class="form-login">
                <input type="email" class="input" placeholder="Felhasználónév" onChange={(e) => {setUsername(e.target.value)}}/>
                <input type="password" class="input" placeholder="Jelszó" onChange={(e) => {setPassword(e.target.value)}}/>
                <p class="page-link">
                <span class="page-link-label">Elfelejtett jelszó?</span>
                </p>
                <button class="form-btn" onClick={handleSubmit}>Bejelentkezés</button>
            </form>
            <p class="sign-up-label">
                Nincs fiókod?<span class="sign-up-link" onClick={goToRegister}>Regisztrálj!</span>
            </p>
            <h3 className='errorLabel'>{error.value}</h3>
        </div>
    </div>
  )
}

export default Login