import React, { useEffect } from 'react'
import { axiosJWT, user } from '../Login/Login'

const UserProfile = () => {

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);

    }
  }, []);

  const justAButton = async (id) => {
    try{
      const res = await axiosJWT.delete(`http://localhost:3500/users/${id}`, {
        headers: {
          authorization: `Bearer ${user.value.accessToken}`
        }
      })
    } catch(error){
    }
    
  }

  const handleDelete = async(e) => {
    e.preventDefault();
    justAButton(user.value.id)
  }

  return (
    <div>
      <button onClick={handleDelete}>X</button>
    </div>
  )
}

export default UserProfile