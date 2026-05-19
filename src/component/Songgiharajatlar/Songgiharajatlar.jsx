import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Trash2, Edit3, Calendar } from "lucide-react";
import ExpenseChart from "../Chart/Chart";
import "./SonggiHarajatlar.css";

const SonggiHarajatlar = () => {
  const { expenses, deleteExpense, editExpense } = useAppContext();
  const [activeTab, setActiveTab] = useState("Bugun");
  
  // Tab logic
  const now = new Date();
  
  const filteredExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    if (activeTab === "Bugun") {
      return expDate.toDateString() === now.toDateString();
    } else if (activeTab === "Bu Oy") {
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    }
    return true; // Umumiy
  });

  const totalAmount = filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Date formatter
  const formatDate = (dateString, tab) => {
    const d = new Date(dateString);
    if (tab === "Bugun") {
      return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleDelete = (id) => {
    if(window.confirm("Rostdan ham bu harajatni o'chirmoqchimisiz?")) {
      deleteExpense(id);
    }
  };

  const handleEdit = (id) => {
    const newName = window.prompt("Yangi nomni kiriting:");
    const newAmount = window.prompt("Yangi summani kiriting:");
    
    if (newName && newAmount && !isNaN(newAmount)) {
      editExpense(id, { itemName: newName, amount: Number(newAmount) });
    }
  };

  return (
    <div className="songgi-container animate-fade-in">
      <h2 className="page-title">Sõnggi Harajatlar</h2>

      <div className="tabs glass-panel">
        <button 
          className={`tab-btn ${activeTab === "Bugun" ? "active" : ""}`}
          onClick={() => setActiveTab("Bugun")}
        >
          BUGUN
        </button>
        <button 
          className={`tab-btn ${activeTab === "Bu Oy" ? "active" : ""}`}
          onClick={() => setActiveTab("Bu Oy")}
        >
          BU OY
        </button>
        <button 
          className={`tab-btn ${activeTab === "Umumiy" ? "active" : ""}`}
          onClick={() => setActiveTab("Umumiy")}
        >
          UMUMIY
        </button>
      </div>

      <div className="expenses-list">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state glass-card">
            <Calendar size={48} className="empty-icon" />
            <p>Bu davr uchun harajatlar topilmadi.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredExpenses.map((exp) => (
              <div key={exp.id} className="expense-card glass-card">
                <div className="card-header">
                  <span className="category-badge">{exp.category}</span>
                  <span className="expense-date">{formatDate(exp.date, activeTab)}</span>
                </div>
                <div className="card-body">
                  <h3 className="expense-name">{exp.itemName}</h3>
                  <p className="expense-amount">${exp.amount}</p>
                </div>
                <div className="card-actions">
                  <button className="action-btn edit" onClick={() => handleEdit(exp.id)}>
                    <Edit3 size={16} />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(exp.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredExpenses.length > 0 && (
        <>
          <div className="total-summary glass-panel">
            <h3>{activeTab === "Bugun" ? "Total today:" : activeTab === "Bu Oy" ? "Total this month:" : "Total all time:"}</h3>
            <p className="total-number">${totalAmount}</p>
          </div>
          
          <div className="chart-wrapper glass-card">
            <h3 className="chart-title">Harajatlar Diagrammasi</h3>
            <ExpenseChart data={filteredExpenses} type={activeTab} />
          </div>
        </>
      )}
    </div>
  );
};

export default SonggiHarajatlar;