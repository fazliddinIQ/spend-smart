import { useAppContext } from "../../context/AppContext";
import "./Navbar.css";
import { Wallet, AlertCircle, CalendarClock, LogOut } from "lucide-react";

const Navbar = () => {
  const { 
    budget, 
    currentMonthTotal, 
    isBudgetExceeded, 
    isBudgetSetForThisMonth,
    todayLimit,
    spentToday,
    remainingToday,
    baseDailyLimit,
    logoutUser
  } = useAppContext();

  const progressPercentage = budget.monthly > 0 
    ? Math.min((currentMonthTotal / budget.monthly) * 100, 100) 
    : 0;

  const dailyProgressPercentage = baseDailyLimit > 0
    ? Math.min((spentToday / baseDailyLimit) * 100, 100)
    : 0;

  return (
    <nav className={`navbar glass-panel ${isBudgetExceeded ? "navbar-danger" : ""}`}>
      <div className="navbar-logo">
        <Wallet size={28} style={{ color: "var(--primary-color)" }} />
        <h2>SMART SPEND</h2>
      </div>

      <div className="navbar-budget-container">
        {!isBudgetSetForThisMonth ? (
          <div className="budget-alert warning">
            <AlertCircle size={20} />
            <span>Iltimos, byudjet kiriting!</span>
          </div>
        ) : (
          <div className="budget-stats-grid">

            {/* Oylik Byudjet */}
            <div className="budget-stat-box">
              <div className="budget-texts">
                <span className="budget-label">
                  Oylik Byudjet: <strong>${budget.monthly}</strong>
                </span>

                <span className="budget-label">
                  Ishlatildi:{" "}
                  <strong
                    style={{
                      color: isBudgetExceeded
                        ? "var(--danger-color)"
                        : "inherit",
                    }}
                  >
                    ${currentMonthTotal}
                  </strong>
                </span>
              </div>

              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: isBudgetExceeded
                      ? "var(--danger-color)"
                      : "var(--primary-color)",
                  }}
                ></div>
              </div>

              {isBudgetExceeded && (
                <span className="danger-text">
                  <AlertCircle size={14} /> Byudjetdan oshdi!
                </span>
              )}
            </div>

            {/* Kunlik Byudjet */}
            <div className="budget-stat-box daily-box">
              <div className="budget-texts">

                <span className="budget-label flex-align">
                  <CalendarClock size={16} />
                  Bugungi Limit:{" "}
                  <strong>
                    ${baseDailyLimit.toFixed(1)}
                  </strong>
                </span>

                <span className="budget-label">
                  Qoldi:{" "}
                  <strong>
                    ${remainingToday.toFixed(1)}
                  </strong>
                </span>
              </div>

              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${dailyProgressPercentage}%`,
                    backgroundColor:
                      dailyProgressPercentage > 90
                        ? "var(--danger-color)"
                        : "var(--success-color)",
                  }}
                ></div>
              </div>

              {dailyProgressPercentage >= 100 && (
                <span className="danger-text">
                  <AlertCircle size={14} /> Kunlik limit tugadi!
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        className="logout-btn"
        onClick={logoutUser}
        title="Tizimdan chiqish"
      >
        <LogOut size={20} />
      </button>
    </nav>
  );
};

export default Navbar;