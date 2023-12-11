import React, { Fragment, useState, useEffect, useRef } from 'react';

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { effect } from '@preact/signals-react';
import { user } from '../../pages/Login/Login';


const Navbar = () => {

  const navigate = useNavigate();
  const inputRef = useRef(null);

  async function Signout() {
    navigate("/signoutconfirm");
  }

  async function goToProfile() {
    navigate("/userprofile");
  }

  return (
    <Fragment>
        <div className='navbar-container'>
          <div className="navbar">
                  <Link to={"/"} id='main'>Főoldal</Link>
                  <div className='login-container' ref={inputRef}>
                    {user.value ? (
                      <Fragment>
                        <Link to={"/userprofile"} id='adatlap'>Adatlap</Link>
                        <Link to={"/signoutconfirm"} id='signout'>Kijelentkezés</Link>
                      </Fragment>
                    ) : (
                      <Link to={"/login"} id='signout'>Bejelentkezés</Link>
                    )}
                  </div>
          </div>
        </div>
    </Fragment>
  );
};

export default Navbar;
