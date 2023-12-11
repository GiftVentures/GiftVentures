import React, {useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {signal} from "@preact/signals-react"
import { user } from '../Login/Login';


var error = signal(" ")


const Register = () => {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [birthDate, setBirthDate] = useState("");
    
    const navigate = useNavigate();
    async function gotoLogin(){
        navigate("/login")
    }

    async function submit(e) {
        e.preventDefault();
        if (password !== passwordRepeat) {
            error.value = "A jelszavak nem egyeznek!"
            return;
          }
        else{
            try {
                const response = await axios.post("http://localhost:3500/register", {
                    username,
                    firstName,
                    secondName,
                    password,  
                    email,
                    mobile,
                    birthDate
                });

                if (response.status == 200) {
                    navigate('/userprofile'); 
                } 

            } catch (e) {
                if (e.response && e.response.status === 409) {
                    error.value = e.response.data.error ;
                }else if (e.response && e.response.status === 400) {
                    error.value = e.response.data.error ;
                } 
                else {
                    error.value = "Ismeretlen hiba történt";
                }
            }
          }
        }


    
  return (
    <div className='login-register-container'>
        <div class="form-register-container">
            <p class="title">Regisztráció</p>
            <form class="form-register">
                <input type="text" class="input" placeholder="Felhasználónév" onChange={(e) => { setUsername(e.target.value)} }/>
                <input type="text" class="input" placeholder="Vezetéknév" onChange={(e) => { setSecondName(e.target.value)} }/>
                <input type="text" class="input" placeholder="Keresztnév" onChange={(e) => { setFirstName(e.target.value)} }/>
                <input type="email" class="input" placeholder="Email" onChange={(e) => { setEmail(e.target.value)} }/>
                <input type="text" class="input" placeholder="Mobil" onChange={(e) => { setMobile(e.target.value)} }/>
                <input type="date" class="input" placeholder="Születésnap" onChange={(e) => { setBirthDate(e.target.value)} }/>
                <input type="password" class="input" placeholder="Jelszó" onChange={(e) => { setPassword(e.target.value)} }/>
                <input type="password" class="input" placeholder="Jelszó újra" onChange={(e) => { setPasswordRepeat(e.target.value)} }/>
                <button class="form-btn" onClick={submit}>Regisztráció</button>
            </form>
            <p class="sign-up-label">
                Van már fiókod?<span class="sign-up-link" onClick={gotoLogin}>Jelentkezz be!</span>
            </p>
            <h3 className='errorLabel'>{error.value}</h3>  
            </div>
    </div>
  )
}

export default Register