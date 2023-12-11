import React from 'react'
import { useNavigate } from 'react-router-dom';
import { isLoggedIn,user } from '../../pages/Login/Login';
import axios from 'axios';
import { axiosJWT } from '../../pages/Login/Login';

const SignoutConfirm = () => {
    const navigate = useNavigate();

    const Signout = async (e) => {
      e.preventDefault();
      try {
          const token = user.value.refreshToken;
          console.log(token);
          const res = await axiosJWT.post("http://localhost:3500/logout", {token}, {
            headers: {
                Authorization: `Bearer ${user.value.accessToken}`
            }
        });
          if (res.status === 200) {
              isLoggedIn.value = null;
              navigate("/login");
          } 
      } catch (err) {
          console.log(err);
      }   
  }

    async function Cancel(){
        navigate(-1)
    }

  return (
    <div className='signout-container'>
        <h1>Biztos ki szeretne jelentkezni?</h1>
        <button onClick={Signout}>Igen</button>
        <button onClick={Cancel}>Nem</button>

    </div>
  )
}

export default SignoutConfirm