import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { LogIn } from "lucide-react";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      setError("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }
    
    const success = loginUser(username, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Username yoki parol noto'g'ri!");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <LogIn size={40} className="auth-icon text-primary" />
          <h2>Tizimga Kirish</h2>
          <p>Davom etish uchun loginingizni kiriting</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-form">
          <input
            className="input-glass"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="input-glass"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary auth-btn" onClick={handleLogin}>
            Kirish
          </button>
        </div>

        <p className="auth-link" onClick={() => navigate("/register")}>
          Hisobingiz yo'qmi? <span>Ro'yxatdan o'ting</span>
        </p>
      </div>
    </div>
  );
}

export default Login;