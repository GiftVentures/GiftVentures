import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = ({ user, onSave, onCancel }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const updatedUser = {
        ...user,
        password,
      };

      const response = await axios.put(`http://localhost:3500/updateUser/${user.username}`, updatedUser);

      if (response.status === 200) {
        onSave(updatedUser);
        navigate(-1);
      } else {
        setError('An error occurred while changing the password.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An error occurred while changing the password.');
    }
  };

  return (
    <div className='change-password'>
      <h1>Jelszó változtatása</h1>
      <table>
        <tr>
          <p>Új jelszó:</p>
          <td><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></td>
        </tr>
        <tr>
          <p>Jelszó megerősítése:</p>
          <td><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></td>
        </tr>
      </table>
        <div>
          {error && <p className="error">{error}</p>}
        </div>
      <div>
        <button onClick={handleChangePassword}>Jelszó változtatása</button>
        <button onClick={onCancel}>Mégse</button>
      </div>
    </div>
  );
};

export default ChangePassword;