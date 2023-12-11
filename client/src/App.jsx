import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import UserProfile from './pages/UserProfile/UserProfile';
import Navbar from './components/Navbar/Navbar';
import SignoutConfirm from './components/SignoutConfirm/SignoutConfirm';
import Main from './pages/Main/Main';


function App() {
  const user = localStorage.getItem("user")
  console.log(user);

  return (
    <div id='App' className="App">
      <Router>
          <Navbar/>
          {user ?  (
          <Routes>
            <Route path='/' element={<Main/>}/>
            <Route path='/userprofile' element={<UserProfile />}/>
            <Route path='/signoutconfirm' element={<SignoutConfirm/>}/>
          </Routes>
          ) : (
          <Routes>
            <Route path='/' element={<Main/>}/>
            <Route path='/login' element={<Login />} /> 
            <Route path='/register' element={<Register />} />
          </Routes>
        )}
              
              
          
      </Router>
    </div>
  );
}

export default App;
