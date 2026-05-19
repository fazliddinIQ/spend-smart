import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { AlertTriangle, Plus } from "lucide-react";
import Budget from "../Budget/Budget";
import "./Harajatqoshish.css";

const HarajatQoshish = () => {
  const { addExpense, isBudgetSetForThisMonth } = useAppContext();
  
  const [category, setCategory] = useState("Kiyim");
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!isBudgetSetForThisMonth) {
      setError("Avval bu oy uchun byudjet kiriting!");
      return;
    }
    
    if (!itemName.trim() || !amount) {
      setError("Barcha maydonlarni to'ldiring!");
      return;
    }

    addExpense({
      itemName,
      amount: Number(amount),
      category
    });

    setItemName("");
    setAmount("");
    setError("");
  };

  return (
    <div className="add-expense-page animate-fade-in">
      <Budget />

      <div className="glass-card form-card">
        <h2 className="page-title">Yangi Harajat Qo'shish</h2>
        
        {error && (
          <div className="error-message">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label>Kategoriya</label>
          <select 
            className="input-glass"
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Kiyim">Kiyim</option>
            <option value="Oziq-ovqat">Oziq-ovqat</option>
            <option value="Transport">Transport</option>
            <option value="Kommunal">Kommunal</option>
            <option value="Boshqa">Boshqa</option>
          </select>
        </div>

        <div className="form-group">
          <label>Harajat nomi</label>
          <input
            className="input-glass"
            type="text"
            placeholder="Masalan: Tushlik"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Summa ($)</label>
          <input
            className="input-glass"
            type="number"
            placeholder="Masalan: 25"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button 
          className="btn btn-primary submit-btn" 
          onClick={handleAdd}
          disabled={!isBudgetSetForThisMonth}
        >
          <Plus size={20} />
          Qo'shish
        </button>
      </div>
    </div>
  );
};

export default HarajatQoshish;