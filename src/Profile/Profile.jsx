import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Lock, Save } from 'lucide-react';
import "./Profile.css";

const Profile = () => {
  const { user, updateProfileUser } = useAppContext();
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await updateProfileUser(username, password);
    setMessage(result.message);
    
    if (result.success) {
      setPassword(""); // Clear password field after successful update
    }
    
    setLoading(false);
  };

  return (
    <div className="profile-container animate-fade-in">
      <h2 className="page-title">Profilni Tahrirlash</h2>

      <div className="profile-card glass-panel">
        <form onSubmit={handleSubmit} className="profile-form">
          
          <div className="form-group">
            <label>Foydalanuvchi nomi</label>
            <div className="input-with-icon">
              <User className="input-icon" size={20} />
              <input
                type="text"
                className="input-glass"
                placeholder="Yangi nom"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Yangi parol (ixtiyoriy)</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                className="input-glass"
                placeholder="Yangi parol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <p className={`profile-message ${message.includes("Xatolik") || message.includes("exists") ? "error" : "success"}`}>
              {message}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={18} />
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
