import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const API_URL = "http://localhost:5000/api";

  // Auth state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("harajatlar_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("harajatlar_token") || null;
  });

  // Barcha harajatlar ro'yxati
  const [expenses, setExpenses] = useState([]);

  // Oylik byudjet
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("harajatlar_budget");
    return saved ? JSON.parse(saved) : { monthly: 0, month: new Date().getMonth() };
  });

  // Dark mode
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("harajatlar_theme") || "light";
  });

  // Axios default headers
  useEffect(() => {
    if (token) {
      // Backend expects the exact token in the authorization header
      axios.defaults.headers.common["Authorization"] = token;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Expenses backend fetching
  useEffect(() => {
    if (user && token) {
      const fetchExpenses = async () => {
        try {
          const res = await axios.get(`${API_URL}/expenses`);
          const formatted = res.data.map(item => ({
             ...item,
             id: item._id,
             date: item.createdAt
          }));
          setExpenses(formatted.reverse());
        } catch (error) {
          console.error("Xarajatlarni olishda xatolik:", error);
        }
      };
      fetchExpenses();
    } else {
      setExpenses([]);
    }
  }, [user, token]);

  // Auth funksiyalari
  const loginUser = async (username, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem("harajatlar_user", JSON.stringify(res.data.user));
      localStorage.setItem("harajatlar_token", res.data.token);
      return true;
    } catch (error) {
      console.log("Login xatosi:", error);
      return false;
    }
  };

  const registerUser = async (username, password) => {
    try {
      await axios.post(`${API_URL}/register`, { username, password });
      return await loginUser(username, password);
    } catch (error) {
      console.log("Register xatosi:", error);
      return false;
    }
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("harajatlar_user");
    localStorage.removeItem("harajatlar_token");
  };

  // Harajat qo'shish
  const addExpense = async (expense) => {
    try {
      const res = await axios.post(`${API_URL}/expenses`, expense);
      const newExpense = {
        ...res.data,
        id: res.data._id,
        date: res.data.createdAt
      };
      setExpenses((prev) => [newExpense, ...prev]);
    } catch (error) {
      console.error("Xarajat qo'shishda xatolik:", error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/expenses/${id}`);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Xarajatni o'chirishda xatolik:", error);
    }
  };

  const editExpense = async (id, updatedExpense) => {
    try {
      await axios.put(`${API_URL}/expenses/${id}`, updatedExpense);
      setExpenses((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updatedExpense } : item))
      );
    } catch (error) {
      console.error("Xarajatni yangilashda xatolik:", error);
    }
  };

  const updateBudget = (amount) => {
    setBudget({ monthly: Number(amount), month: new Date().getMonth() });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // LocalStorage Effects
  useEffect(() => {
    localStorage.setItem("harajatlar_budget", JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem("harajatlar_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Hisob kitoblar
  const currentMonthExpenses = expenses.filter(
    (e) => new Date(e.date).getMonth() === new Date().getMonth() &&
           new Date(e.date).getFullYear() === new Date().getFullYear()
  );

  const currentMonthTotal = currentMonthExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const todayExpenses = currentMonthExpenses.filter(
    (e) => new Date(e.date).toDateString() === new Date().toDateString()
  );
  
  const spentToday = todayExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const spentUntilYesterday = currentMonthTotal - spentToday;

  // Kunlik limit logikasi
  const now = new Date();
  const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();

  const baseDailyLimit = budget.monthly > 0 ? (budget.monthly / totalDaysInMonth) : 0;
  
  // Bugungacha qancha ishlatishga ruxsat bor edi
  const accumulatedLimit = baseDailyLimit * currentDay;

  // Bugun ishlatsa bo'ladigan limit (kechadan ortib qolgan pullar qo'shilgan holda)
  const todayLimit = Math.max(0, accumulatedLimit - spentUntilYesterday);
  
  // Bugungi limitdan qancha qoldi
  const remainingToday = Math.max(0, baseDailyLimit - spentToday);

  const isBudgetExceeded = budget.monthly > 0 && currentMonthTotal > budget.monthly;
  const isBudgetSetForThisMonth = budget.monthly > 0 && budget.month === new Date().getMonth();

  return (
    <AppContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        logoutUser,
        expenses,
        budget,
        theme,
        addExpense,
        deleteExpense,
        editExpense,
        updateBudget,
        toggleTheme,
        currentMonthTotal,
        isBudgetExceeded,
        isBudgetSetForThisMonth,
        todayLimit,
        spentToday,
        remainingToday,
        baseDailyLimit
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
