import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { UserPlus } from "lucide-react";
import "../Login/Login.css"; // Reuse the same CSS

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { registerUser } = useAppContext();
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!username || !password) {
      setError("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    if (password.length < 4) {
      setError("Parol kamida 4 ta belgidan iborat bo'lishi kerak");
      return;
    }

    const success = registerUser(username, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Bu username allaqachon mavjud!");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <UserPlus size={40} className="auth-icon text-primary" />
          <h2>Ro'yxatdan O'tish</h2>
          <p>Yangi hisob yaratish uchun ma'lumotlarni kiriting</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-form">
          <input
            className="input-glass"
            placeholder="Yangi Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="input-glass"
            type="password"
            placeholder="Yangi Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary auth-btn" onClick={handleRegister}>
            Ro'yxatdan O'tish
          </button>
        </div>

        <p className="auth-link" onClick={() => navigate("/login")}>
          Allaqachon hisobingiz bormi? <span>Kirish</span>
        </p>
      </div>
    </div>
  );
}

export default Register;