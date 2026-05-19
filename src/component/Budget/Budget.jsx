import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import "./Budget.css";

const Budget = () => {
  const { budget, updateBudget, isBudgetSetForThisMonth } = useAppContext();
  const [amount, setAmount] = useState("");

  const handleSave = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Iltimos, to'g'ri summa kiriting!");
      return;
    }
    updateBudget(amount);
    setAmount("");
  };

  return (
    <div className="budget-container glass-card">
      <h3 className="budget-title">Byudjetni Sozlash</h3>
      <p className="budget-desc">Har oy uchun qancha harajat qilishingizni belgilang.</p>
      
      <div className="budget-form">
        <input
          type="number"
          className="input-glass"
          placeholder={isBudgetSetForThisMonth ? `Hozirgi byudjet: $${budget.monthly}` : "Summa kiriting ($)"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSave}>
          {isBudgetSetForThisMonth ? "Yangilash" : "Saqlash"}
        </button>
      </div>
    </div>
  );
};

export default Budget;