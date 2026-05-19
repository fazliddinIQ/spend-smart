import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("harajatlar_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Barcha harajatlar ro'yxati
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("harajatlar_data");
    return saved ? JSON.parse(saved) : [];
  });

  // Oylik byudjet
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("harajatlar_budget");
    return saved ? JSON.parse(saved) : { monthly: 0, month: new Date().getMonth() };
  });

  // Dark mode
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("harajatlar_theme") || "light";
  });

  // Auth funksiyalari
  const loginUser = (username, password) => {
    const users = JSON.parse(localStorage.getItem("harajatlar_users_db") || "[]");
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const registerUser = (username, password) => {
    const users = JSON.parse(localStorage.getItem("harajatlar_users_db") || "[]");
    if (users.find(u => u.username === username)) {
      return false; // already exists
    }
    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem("harajatlar_users_db", JSON.stringify(users));
    setUser(newUser);
    return true;
  };

  const logoutUser = () => {
    setUser(null);
  };

  // Harajat qo'shish
  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const editExpense = (id, updatedExpense) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedExpense } : item))
    );
  };

  const updateBudget = (amount) => {
    setBudget({ monthly: Number(amount), month: new Date().getMonth() });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // LocalStorage Effects
  useEffect(() => {
    if (user) {
      localStorage.setItem("harajatlar_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("harajatlar_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("harajatlar_data", JSON.stringify(expenses));
  }, [expenses]);

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
