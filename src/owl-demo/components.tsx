import { type ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Chart from "chart.js/auto";
import "./styles.css";

/* ---------------------------------------------------------------------------
 * OWL product demo
 *
 * The components below are ports of the real OWL desktop app:
 *
 *   Navigation: NavBar, NavButton (Navigation/Navbar.tsx)
 *   Welcome:    WelcomeTab, DateBlock, TimeBlock, Calendar, CalendarWidget,
 *               QuoteWidget (Welcome/WelcomeComponents.tsx, Welcome/Widgets.tsx)
 *   Tasks:      TasksTab, BoardsListHeader, BoardElement, Column,
 *               ColumnHeader, Task, TaskContent, TaskList (Tasks/*.tsx)
 *   Projects:   ProjectsTab, ProjectsHeader, ProjectsList, ProjectCard
 *               (Projects/*.tsx)
 *   Stats:      StatisticTab, Block, BlockIcon, BlockContent, and the
 *               dedicated metric blocks + TasksChartBlock, ProjectsChartBlock
 *               (Statistics/StatisticsComponents.tsx, Charts/*.tsx)
 *
 * Names, markup and class names match the app. Only the // <demo> data and
 * autoplay timers are synthetic (the app would fetch from its local API).
 * ------------------------------------------------------------------------- */

type TabId = "home" | "tasks" | "projects" | "stats";

const TABS: Record<TabId, string> = {
  home: "Home",
  tasks: "Tasks",
  projects: "Projects",
  stats: "Statistics",
};

/* defaultColors() from Other/ColorPickerModal.tsx of the app */
const defaultColors = [
  "var(--red)",
  "var(--green)",
  "var(--blue)",
  "var(--yellow)",
  "var(--pink)",
  "var(--purple)",
  "var(--cyan)",
  "var(--fg)",
];

function getTextColorForBg(bg: string): string {
  return defaultColors.includes(bg) ? "var(--bg)" : "var(--fg)";
}

const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-EN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* --------------------- Pomodoro (Pomodoro/*.tsx of the app) ------------------- */

const CircularProgressBar: React.FC<{
  progress?: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
}> = ({
  progress = 0,
  size = 160,
  strokeWidth = 12,
  trackColor = "var(--bg3)",
  progressColor = "var(--accent)",
}) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * ((100 - normalizedProgress) / 100);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        r={radius}
        cx={size / 2}
        cy={size / 2}
        fill="transparent"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      <circle
        r={radius}
        cx={size / 2}
        cy={size / 2}
        fill="transparent"
        stroke={progressColor}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference}px`}
        strokeDashoffset={`${offset}px`}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
      />
    </svg>
  );
};

const PomodoroModal: React.FC<{
  workTime: number;
  breakTime: number;
  isWorking: boolean;
  timeLeft: number;
  isRunning: boolean;
  startPauseTimer: () => void;
  resetTimer: () => void;
  switchMode: () => void;
}> = ({
  workTime,
  breakTime,
  isWorking,
  timeLeft,
  isRunning,
  startPauseTimer,
  resetTimer,
  switchMode,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const progress = (timeLeft / ((isWorking ? workTime : breakTime) * 60)) * 100;

  return (
    <motion.div
      className="pomodoro-modal centered_content"
      initial={{ opacity: 0, y: -300 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -300 }}
      transition={{ duration: 0.3 }}
      style={{
        background: "var(--bg2)",
        borderRadius: "var(--spacing-xl)",
        padding: "var(--spacing-l)",
        width: "500px",
        height: "180px",
        marginTop: "60px",
        boxShadow: "var(--shadow-l)",
        position: "fixed",
        top: "0px",
        flexDirection: "row",
        left: "calc(50% - 250px - var(--spacing-s) - var(--spacing-s))",
        zIndex: 100,
        cursor: "auto",
        gap: "10%",
      }}
    >
      <div
        style={{
          width: "50%",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-s)",
        }}
      >
        <p
          style={{
            width: "100%",
            textAlign: "left",
            margin: "0px",
            padding: "0px",
            fontSize: "xxx-large",
            color: "var(--fg)",
            fontWeight: "bolder",
          }}
        >
          {formatTime(timeLeft)}
        </p>
        <p
          style={{
            width: "100%",
            textAlign: "left",
            margin: "0px",
            padding: "0px",
            fontSize: "medium",
            color: "var(--fg)",
          }}
        >
          {isWorking ? "Work" : "Break"}
        </p>
        <div
          className="centered_content"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-s)",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: "var(--spacing-s)",
            }}
          >
            <button
              className="button"
              onClick={resetTimer}
              style={{
                background: "var(--bg)",
                color: "var(--fg)",
                width: "100%",
                transition: "all 0.3s ease",
                cursor: "pointer",
                boxShadow: "var(--shadow)",
              }}
            >
              Reset
            </button>
            <button
              className="button"
              onClick={switchMode}
              style={{
                background: "var(--bg)",
                color: "var(--fg)",
                width: "100%",
                transition: "all 0.3s ease",
                cursor: "pointer",
                boxShadow: "var(--shadow)",
              }}
            >
              Switch
            </button>
          </div>
        </div>
      </div>
      <div style={{ gap: "0px", position: "relative", width: "180px", height: "180px" }}>
        <CircularProgressBar
          progress={progress}
          size={180}
          strokeWidth={20}
          trackColor="var(--bg)"
          progressColor={isWorking ? "var(--red)" : "var(--green)"}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "x-large",
            fontWeight: "bold",
            color: "var(--fg)",
            padding: "0px",
            margin: "0px",
          }}
        >
          <button
            className="button centered_content"
            onClick={startPauseTimer}
            style={{
              color: "var(--bg)",
              background: "transparent",
              transition: "all 0.3s ease",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100px",
              height: "100px",
              border: "none",
              boxShadow: "none",
              padding: "0px",
              margin: "0px",
            }}
          >
            {isRunning ? (
              <i
                style={{
                  fontSize: "60px",
                  width: "60px",
                  height: "60px",
                  padding: "0px",
                  margin: "0px",
                  color: "var(--fg)",
                }}
                className="fa-solid fa-pause"
              ></i>
            ) : (
              <i
                style={{
                  fontSize: "60px",
                  width: "60px",
                  height: "60px",
                  padding: "0px",
                  margin: "0px",
                  color: "var(--fg)",
                }}
                className="fa-solid fa-play"
              ></i>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const DemoPomodoroTimer: React.FC = () => {
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [workTime] = useState(25);
  const [breakTime] = useState(5);
  const [isWorking, setIsWorking] = useState(true);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsWorking(!isWorking);
      setTimeLeft((isWorking ? breakTime : workTime) * 60);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isWorking, workTime, breakTime]);

  const startPauseTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(workTime * 60);
    setIsWorking(true);
  };
  const switchMode = () => {
    setIsRunning(false);
    setIsWorking(!isWorking);
    setTimeLeft((isWorking ? breakTime : workTime) * 60);
  };
  const toggleModal = () => setIsPomodoroOpen((prev) => !prev);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {isRunning ? (
        <button
          onClick={toggleModal}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "transparent",
            backdropFilter: "blur(10px)",
            borderRadius: "var(--spacing-l)",
            height: "30px",
            width: "auto",
            cursor: "pointer",
            position: "relative",
            color: "var(--fg)",
            fontSize: "medium",
            gap: "var(--spacing-s)",
            border: "none",
            padding: "var(--spacing-l)",
            paddingLeft: "var(--spacing-s)",
            paddingRight: "var(--spacing-s)",
            boxShadow: "none",
          }}
        >
          <CircularProgressBar
            size={30}
            strokeWidth={5}
            trackColor="var(--bg)"
            progressColor={isWorking ? "var(--red)" : "var(--green)"}
            progress={(timeLeft / ((isWorking ? workTime : breakTime) * 60)) * 100}
          />
          <span style={{ zIndex: 1 }}>
            {isWorking ? "Work" : "Break"} {formatTime(timeLeft)}
          </span>
        </button>
      ) : (
        <button
          onClick={toggleModal}
          className="navigate_button centered_content"
          style={{ height: "40px", width: "40px" }}
        >
          <i className="fa-solid fa-clock"></i>
          <span className="tooltip">Pomodoro</span>
        </button>
      )}

      <AnimatePresence>
        {isPomodoroOpen && (
          <PomodoroModal
            key="pomodoro-modal"
            workTime={workTime}
            breakTime={breakTime}
            isWorking={isWorking}
            timeLeft={timeLeft}
            isRunning={isRunning}
            startPauseTimer={startPauseTimer}
            resetTimer={resetTimer}
            switchMode={switchMode}
          />
        )}
      </AnimatePresence>
    </>
  );
};

/* ------------------------------- Navigation ---------------------------------- */

const NavButton: React.FC<{
  id: TabId;
  icon: string;
  text: string;
  isActive: boolean;
  onTabChange: (id: TabId) => void;
}> = ({ id, icon, text, isActive, onTabChange }) => (
  <button
    className={`navigate_button centered_content ${isActive ? "active" : ""}`}
    onClick={() => onTabChange(id)}
    style={{
      border: isActive ? "4px solid var(--accent)" : "4px solid transparent",
      backdropFilter: isActive ? "var(--bg-filter)" : "none",
      height: "45px",
      width: isActive ? "90px" : "45px",
      ...(isActive
        ? { backgroundColor: "var(--accent-disabled)", color: "var(--accent)" }
        : {}),
    }}
  >
    <i className={`fa-solid ${icon}`}></i>
    <span className="tooltip">{text}</span>
  </button>
);

type NavBarProps = { activeTab: TabId; onTabChange: (tab: TabId) => void };

const NavBar: React.FC<NavBarProps> = ({ activeTab, onTabChange }) => {
  const navItems: Array<{ id: TabId; icon: string; text: string }> = [
    { id: "home", icon: "fa-house", text: TABS.home },
    { id: "tasks", icon: "fa-circle-check", text: TABS.tasks },
    { id: "projects", icon: "fa-code-branch", text: TABS.projects },
    { id: "stats", icon: "fa-chart-simple", text: TABS.stats },
  ];

  return (
    <div className="mac_titlebar drag" id="mac_titlebar">
      <div className="control_button no-drag">
        <button className="dot red" />
        <button className="dot yellow" />
        <button className="dot green" />
      </div>

      <div className="drag_handler drag" id="navbar">
        <div
          className="navbar"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "var(--spacing-s)",
              alignItems: "center",
            }}
          >
            {navItems.map((item) => (
              <NavButton
                key={item.id}
                id={item.id}
                icon={item.icon}
                text={item.text}
                isActive={activeTab === item.id}
                onTabChange={onTabChange}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="no-drag"
        style={{
          paddingRight: "var(--spacing-m)",
          display: "flex",
          alignItems: "center",
          zIndex: 500,
        }}
      >
        <DemoPomodoroTimer />
      </div>
    </div>
  );
};

/* --------------------------------- Welcome ----------------------------------- */

const TimeBlock: React.FC = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    update();
    const id = setInterval(update, 60 * 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <h1
      style={{
        fontSize: "1.5rem",
        fontWeight: "bolder",
        padding: "0px",
        margin: "0px",
      }}
    >
      {time}
    </h1>
  );
};

const DateBlock: React.FC = () => {
  const [date, setDate] = useState({ day: "", month: "", weekday: "" });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDate({
        day: now.getDate().toString(),
        month: now.toLocaleString("en-US", { month: "short" }),
        weekday: now.toLocaleString("en-US", { weekday: "short" }),
      });
    };
    update();
    const id = setInterval(update, 60 * 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div
      className="widget_block"
      id="date_block"
      style={{
        padding: "32px",
        margin: "0px",
        zIndex: "50",
        minHeight: "150px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
          gap: "var(--spacing-xl)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: "5rem",
              padding: "0px",
              margin: "0px",
              color: "var(--accent)",
              fontWeight: "bolder",
              lineHeight: 1,
            }}
          >
            {date.day}
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "var(--spacing-s)",
            textAlign: "left",
          }}
        >
          <TimeBlock />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: "var(--spacing-s)",
              textAlign: "left",
            }}
          >
            <h2
              style={{
                textAlign: "left",
                padding: "0px",
                margin: "0px",
                fontSize: "medium",
                fontWeight: "normal",
                opacity: 0.7,
              }}
            >
              {date.weekday}
            </h2>
            <h2
              style={{
                textAlign: "left",
                padding: "0px",
                margin: "0px",
                fontSize: "medium",
                fontWeight: "normal",
                opacity: 0.7,
              }}
            >
              {date.month}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

const Calendar: React.FC = () => {
  const [currentDate] = useState(new Date());
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const renderWeekdayHeaders = () =>
    weekDays.map((d, i) => (
      <div
        key={`weekday-${i}`}
        style={{
          fontSize: "small",
          opacity: 0.7,
          color: "var(--fg)",
          textAlign: "center",
          fontWeight: 600,
          padding: "2px 0",
        }}
      >
        {d}
      </div>
    ));

  const renderEmptyCells = () =>
    Array.from({ length: firstDayOfMonth }).map((_, i) => (
      <div key={`empty-${i}`} />
    ));

  const renderDayCells = () =>
    Array.from({ length: daysInMonth }).map((_, day) => {
      const isToday =
        day + 1 === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();
      const backgroundColor = isToday ? "var(--accent)" : "transparent";
      const textColor = isToday ? "var(--bg)" : "var(--fg)";
      return (
        <button
          key={`day-${day}`}
          className="calendar-day centered_content"
          style={{
            padding: "4px",
            backgroundColor,
            color: textColor,
            fontWeight: isToday ? 700 : 500,
            margin: "4px 0",
            cursor: "pointer",
            border: "none",
            background: backgroundColor,
            borderRadius: "var(--border-radius)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {day + 1}
        </button>
      );
    });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "var(--spacing-s)",
          gap: "var(--spacing-s)",
          height: "60px",
        }}
      >
        <div style={{ display: "flex", gap: "var(--spacing-s)" }}>
          <button
            className="button"
            style={{
              height: "20px",
              minHeight: "20px",
              aspectRatio: "1/1",
              borderRadius: "10px",
              color: "var(--fg)",
              padding: "0px",
              margin: "0px",
              background: "var(--bg)",
              border: "none",
              cursor: "pointer",
              boxShadow: "none",
            }}
            title="Previous Year"
          />
          <button
            className="button"
            style={{
              height: "20px",
              minHeight: "20px",
              aspectRatio: "1.5/1",
              borderRadius: "10px",
              color: "var(--fg)",
              padding: "0px",
              margin: "0px",
              background: "var(--bg)",
              border: "none",
              cursor: "pointer",
              boxShadow: "none",
            }}
            title="Previous Month"
          />
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: "medium",
            minWidth: "150px",
            textAlign: "center",
            color: "var(--fg)",
          }}
        >
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div style={{ display: "flex", gap: "var(--spacing-s)" }}>
          <button
            className="button"
            style={{
              height: "20px",
              minHeight: "20px",
              aspectRatio: "1.5/1",
              borderRadius: "10px",
              color: "var(--fg)",
              padding: "0px",
              margin: "0px",
              background: "var(--bg)",
              border: "none",
              cursor: "pointer",
              boxShadow: "none",
            }}
            title="Next Month"
          />
          <button
            className="button"
            style={{
              height: "20px",
              minHeight: "20px",
              aspectRatio: "1/1",
              borderRadius: "10px",
              color: "var(--fg)",
              padding: "0px",
              margin: "0px",
              background: "var(--bg)",
              border: "none",
              cursor: "pointer",
              boxShadow: "none",
            }}
            title="Next Year"
          />
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "2px",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {renderWeekdayHeaders()}
        {renderEmptyCells()}
        {renderDayCells()}
      </div>
    </div>
  );
};

const CalendarWidget: React.FC = () => (
  <div
    className="widget_block"
    id="calendar-widget"
    style={{
      padding: "var(--spacing-xl)",
      margin: "0px",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "50",
      overflow: "visible",
      position: "relative",
      gridColumn: 2,
      gridRow: "1 / span 2",
      boxSizing: "border-box",
    }}
  >
    <Calendar />
  </div>
);

const QuoteWidget: React.FC = () => {
  const quote = {
    content: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  };
  return (
    <div
      className="centered_content widget_block quote-widget"
      style={{ padding: "var(--spacing-xl)", minHeight: "150px" }}
    >
      <div
        style={{
          fontStyle: "italic",
          marginBottom: "8px",
          lineHeight: "1.4",
          flex: "1",
          fontWeight: "bolder",
        }}
      >
        {quote.content}
      </div>
      <div style={{ fontSize: "small", opacity: 0.7 }}>
        {" "}
        ~ {quote.author} ~{" "}
      </div>
    </div>
  );
};

/* -------------------------- Statistics (Blocks) ------------------------------ */

const BlockIcon: React.FC<{ iconClass: string; color: string }> = ({
  iconClass,
  color,
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      minHeight: "0px",
      padding: "0px",
      margin: "0px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
    }}
  >
    <i
      className={`emoji ${iconClass}`}
      style={{
        color,
        alignContent: "right",
        alignItems: "right",
        justifyContent: "center",
        textAlign: "right",
        width: "100%",
      }}
    />
  </div>
);

const BlockContent: React.FC<{
  text: string;
  subtitle: string;
  value: string;
}> = ({ text, subtitle, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      height: "100%",
    }}
  >
    <div
      style={{
        width: "100%",
        textAlign: "left",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: "var(--spacing-s)",
      }}
    >
      <h1 style={{ width: "auto", fontWeight: "1000" }}>{value}</h1>
      <h2>{text}</h2>
    </div>
    <h3 style={{ marginTop: "5px" }}>{subtitle}</h3>
  </div>
);

const Block: React.FC<{
  iconClass: string;
  color: string;
  text: string;
  subtitle: string;
  value: string | number;
}> = ({ iconClass, color, text, subtitle, value }) => (
  <div className="square_block centered_content">
    <BlockIcon iconClass={iconClass} color={color} />
    <BlockContent text={text} subtitle={subtitle} value={String(value)} />
  </div>
);

/* Drift helpers: each metric block pulses inside a small range so the page
   looks alive even though there is no backend. */
function useTimer(ms: number): number {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return t;
}

const CurrentStreakBlock: React.FC = () => {
  const t = useTimer(4000);
  return (
    <Block
      iconClass="fa-solid fa-fire"
      color="var(--red)"
      text="days"
      subtitle="current streak"
      value={`${6 + (t % 2)}`}
    />
  );
};

const TodayTasksBlock: React.FC = () => {
  const t = useTimer(4000);
  return (
    <Block
      iconClass="fa-solid fa-fire-flame-curved"
      color="var(--accent)"
      text="tasks"
      subtitle="on today"
      value={`${4 + (t % 2)}`}
    />
  );
};

const DaysActivityBlock: React.FC = () => {
  const t = useTimer(6000);
  return (
    <Block
      iconClass="fa-regular fa-circle-check"
      color="var(--accent)"
      text="days"
      subtitle="total"
      value={`${24 + (t % 2)}`}
    />
  );
};

const TasksProgressBlock: React.FC = () => {
  const total = 30;
  const completed = 18 + (useTimer(6000) % 2);
  const progress = Math.round((completed / total) * 100);
  return (
    <Block
      iconClass="fa-regular fa-face-grin-stars"
      color="var(--green)"
      text="tasks"
      subtitle={`${completed}/${total} completed`}
      value={`${progress}%`}
    />
  );
};

const LongestStreakBlock: React.FC = () => {
  const t = useTimer(6000);
  return (
    <Block
      iconClass="fa-regular fa-star"
      color="var(--yellow)"
      text="days"
      subtitle="longest streak"
      value={`${11 + (t % 2)}`}
    />
  );
};

const TotalProjectsBlock: React.FC = () => {
  const t = useTimer(6000);
  return (
    <Block
      iconClass="fa-solid fa-meteor"
      color="var(--purple)"
      text="projects"
      subtitle="total projects"
      value={`${17 + (t % 2)}`}
    />
  );
};

const DeadlineProjectsBlock: React.FC = () => {
  return (
    <Block
      iconClass="fa-solid fa-fire"
      color="var(--red)"
      text="projects"
      subtitle="end of month"
      value="2"
    />
  );
};

/* ---------------------------------- Charts ----------------------------------- */

const TasksChartBlock: React.FC = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const instance = useRef<Chart | null>(null);
  const labels: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    labels.push(
      `${d.toLocaleDateString("en-US", { month: "short" })} ${d.getDate()}`,
    );
  }
  const counts = [3, 5, 4, 7, 6, 9, 8];

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    if (instance.current) instance.current.destroy();
    instance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Completed tasks",
            data: counts,
            borderColor: "#f0ede8",
            backgroundColor: "#f0ede8",
            borderWidth: 3,
            tension: 0.5,
            pointRadius: 4,
            pointBackgroundColor: "#e0c17c",
            pointBorderColor: "#f0ede8",
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { display: false, beginAtZero: true, grid: { display: false } },
          x: { display: false, grid: { display: false } },
        },
      },
    });
    return () => {
      if (instance.current) instance.current.destroy();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="chart_element tasks_chart">
      <canvas ref={ref} />
    </div>
  );
};

const ProjectsChartBlock: React.FC = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const instance = useRef<Chart | null>(null);
  const data = [
    { label: "Completed", count: 9, color: "#7cc98b" },
    { label: "In Progress", count: 4, color: "#7cb8c9" },
    { label: "On Hold", count: 2, color: "#e0c17c" },
    { label: "Planned", count: 3, color: "#a68fc9" },
  ];

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    if (instance.current) instance.current.destroy();
    instance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            data: data.map((d) => d.count),
            backgroundColor: data.map((d) => d.color),
            borderColor: "#1b1913",
            borderWidth: 3,
            borderRadius: 6,
            spacing: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "64%",
        animation: false,
        plugins: { legend: { display: false } },
      },
    });
    return () => {
      if (instance.current) instance.current.destroy();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="square_block centered_content projects_chart">
      <canvas className="projectsChart" ref={ref} />
    </div>
  );
};

/* ------------------------------- Home tab ------------------------------------ */

const WelcomeTab: React.FC = () => (
  <motion.div
    className="centered_content"
    id="main_tab"
    style={{
      gap: "var(--spacing-xl)",
      height: "100%",
      width: "auto",
      padding: "var(--spacing-l)",
      margin: "0px",
    }}
  >
    <div className="welcome_grid">
      <DateBlock />
      <CalendarWidget />
      <QuoteWidget />
      <div className="stat_blocks_row">
        <DaysActivityBlock />
        <CurrentStreakBlock />
        <TodayTasksBlock />
      </div>
    </div>
  </motion.div>
);

/* ------------------------------- Tasks tab ----------------------------------- */

interface DemoTask {
  id: string;
  content: string;
  completed: boolean;
  deadline?: string;
}

interface DemoColumn {
  id: string;
  title: string;
  color: string;
  tasks: DemoTask[];
}

interface DemoBoard {
  id: string;
  title: string;
  columns: DemoColumn[];
}

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const copy = Array.from(arr);
  const [removed] = copy.splice(from, 1);
  copy.splice(to, 0, removed);
  return copy;
}

/* index of the drop target based on the pointer position inside a container
   (works inside the CSS-scaled demo: getBoundingClientRect is scaled already) */
function indexOfChildAtPoint(container: HTMLElement | null, client: number, axis: "x" | "y"): number {
  if (!container) return 0;
  const children = Array.from(container.children).filter(
    (child) =>
      child instanceof HTMLElement &&
      child.getBoundingClientRect().height > 0 &&
      child.getBoundingClientRect().width > 0,
  );
  let idx = children.length;
  for (let i = 0; i < children.length; i++) {
    const rect = children[i].getBoundingClientRect();
    const mid = axis === "x" ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
    if (client < mid) {
      idx = i;
      break;
    }
  }
  return idx;
}

/* target column slot for a horizontal drop: snap to the nearest real (non-mini)
   column center so dropping a column ONTO another column reliably reorders. */
function columnSlotIndex(kanban: HTMLElement | null, clientX: number): number {
  if (!kanban) return 0;
  const cols = Array.from(kanban.children).filter(
    (child) =>
      child instanceof HTMLElement &&
      !child.classList.contains("mini-task-main-block") &&
      child.getBoundingClientRect().width > 0,
  );
  if (cols.length === 0) return 0;
  let best = 0;
  let bestDist = Infinity;
  cols.forEach((col, i) => {
    const r = col.getBoundingClientRect();
    const dist = Math.abs(clientX - (r.left + r.width / 2));
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}

/* Chromium renders the HTML5 drag ghost at the element's layout size, ignoring
   ancestor transforms (the demo's scale(0.55)). Fix: snapshot a clone whose
   scale is applied on the element itself, and offset the ghost by the scaled
   pointer position. The clone must stay inside .owl-demo so the demo's scoped
   CSS (classes + custom properties) still applies to it. */
function setScaledDragImage(e: React.DragEvent): void {
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const scale = rect.width > 0 && el.offsetWidth > 0 ? rect.width / el.offsetWidth : 1;
  if (Math.abs(scale - 1) < 0.01) return;
  const ghost = el.cloneNode(true) as HTMLElement;
  ghost.style.position = "fixed";
  ghost.style.left = "-10000px";
  ghost.style.top = "0px";
  ghost.style.width = `${el.offsetWidth}px`;
  ghost.style.height = `${el.offsetHeight}px`;
  ghost.style.transform = `scale(${scale})`;
  ghost.style.transformOrigin = "top left";
  ghost.style.pointerEvents = "none";
  ghost.setAttribute("aria-hidden", "true");
  (el.closest(".owl-demo") ?? document.body).appendChild(ghost);
  e.dataTransfer.setDragImage(ghost, e.clientX - rect.left, e.clientY - rect.top);
  setTimeout(() => ghost.remove(), 0);
}

const INITIAL_COLUMNS: DemoColumn[] = [
  {
    id: "col-1",
    title: "Backlog",
    color: "var(--bg2)",
    tasks: [
      {
        id: "t-101",
        content: "Gather requirements for weekly report",
        completed: false,
        deadline: "2026-07-12",
      },
      {
        id: "t-102",
        content: "Refactor dashboard charts",
        completed: false,
        deadline: "2026-07-18",
      },
      {
        id: "t-103",
        content: "Update onboarding copy",
        completed: false,
        deadline: "2026-08-01",
      },
    ],
  },
  {
    id: "col-2",
    title: "In Progress",
    color: "var(--bg2)",
    tasks: [
      {
        id: "t-201",
        content: "Design system tokens",
        completed: false,
        deadline: "2026-08-02",
      },
      {
        id: "t-202",
        content: "Wire kanban autosave",
        completed: true,
        deadline: "2026-08-03",
      },
      {
        id: "t-203",
        content: "Polish profile modal",
        completed: false,
        deadline: "2026-08-05",
      },
    ],
  },
  {
    id: "col-3",
    title: "Completed",
    color: "var(--bg2)",
    tasks: [
      {
        id: "t-301",
        content: "Dark theme palette",
        completed: true,
        deadline: "2026-07-28",
      },
      {
        id: "t-302",
        content: "Pomodoro timer",
        completed: true,
        deadline: "2026-07-29",
      },
      {
        id: "t-303",
        content: "Task drag & drop",
        completed: true,
        deadline: "2026-08-01",
      },
    ],
  },
];

const OPS_COLUMNS: DemoColumn[] = [
  {
    id: "ops-1",
    title: "Todo",
    color: "var(--bg2)",
    tasks: [
      { id: "o-101", content: "Rotate on-call schedule", completed: false, deadline: "2026-08-04" },
      { id: "o-102", content: "Update incident runbook", completed: false, deadline: "2026-08-07" },
    ],
  },
  {
    id: "ops-2",
    title: "Doing",
    color: "var(--bg2)",
    tasks: [
      { id: "o-201", content: "Migrate CI runners", completed: false, deadline: "2026-08-09" },
    ],
  },
  {
    id: "ops-3",
    title: "Done",
    color: "var(--bg2)",
    tasks: [
      { id: "o-301", content: "Provision staging env", completed: true, deadline: "2026-07-30" },
      { id: "o-302", content: "Setup log shipping", completed: true, deadline: "2026-07-31" },
    ],
  },
];

const INITIAL_BOARDS: DemoBoard[] = [
  { id: "board-1", title: "Product", columns: INITIAL_COLUMNS },
  { id: "board-2", title: "Ops", columns: OPS_COLUMNS },
];

const TaskContent: React.FC<{
  task: DemoTask;
  columnId: string;
  bg_color: string;
  onToggleTask: (columnId: string, taskId: string) => void;
}> = ({ task, columnId, bg_color, onToggleTask }) => (
  <div
    className="task-content"
    role="button"
    tabIndex={0}
    aria-label={`Task: ${task.content}`}
    style={{ width: "100%" }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "50px",
            width:
              "calc(100% - var(--spacing-m) - var(--spacing-m) - var(--spacing-m))",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0px",
          }}
        >
          <input
            className="checkbox"
            style={{ margin: "0px", padding: "0px", cursor: "pointer" }}
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleTask(columnId, task.id)}
          />
          <p
            className="task-text centered_content"
            style={{
              opacity: "0.9",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "var(--spacing-s)",
              color: getTextColorForBg(bg_color),
            }}
          >
            <span style={{ width: "auto", padding: "0px", margin: "0px" }}>
              Deadline:
            </span>
            <span
              style={{
                padding: "0px",
                margin: "0px",
                textAlign: "right",
                width: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {task.deadline ? fmtDate(task.deadline) : "No deadline"}
            </span>
          </p>
        </div>
        <button
          className="task-text"
          style={{
            backgroundColor: "transparent",
            border: "none",
            width: "calc(100% - 50px)",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            cursor: "text",
            height: "auto",
            padding: "0px",
            margin: "0px",
            paddingBottom: "var(--spacing-m)",
            color: getTextColorForBg(bg_color),
          }}
        >
          {task.content}
        </button>
      </div>
    </div>
  </div>
);

const Task: React.FC<{
  task: DemoTask;
  columnId: string;
  color: string;
  onToggleTask: (columnId: string, taskId: string) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
}> = ({ task, columnId, color, onToggleTask, onDragStart, onDragEnd }) => (
  <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 1, scale: 1 }}>
    <div
      draggable
      className="task-container"
      style={{ backgroundColor: color || "var(--bg2)", cursor: "grab" }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <TaskContent task={task} columnId={columnId} bg_color={color} onToggleTask={onToggleTask} />
    </div>
  </motion.div>
);

const ColumnHeader: React.FC<{
  column: DemoColumn;
  onCreateTask: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
}> = ({ column, onCreateTask, onDragStart, onDragEnd }) => (
  <div
    className="task-block-header"
    role="button"
    tabIndex={0}
    draggable
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    style={{
      backgroundColor: column.color,
      color: getTextColorForBg(column.color),
      cursor: "grab",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        className="task-count"
        style={{ color: getTextColorForBg(column.color) }}
      >
        ( {column.tasks.length} )
      </button>
      <h3
        className="task-block-title"
        style={{ color: getTextColorForBg(column.color) }}
      >
        {column.title}
      </h3>
    </div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button
        className="tr_button"
        style={{
          width: "100%",
          height: "40px",
          position: "relative",
          bottom: "0px",
          color: getTextColorForBg(column.color),
        }}
        onClick={onCreateTask}
      >
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  </div>
);

const TaskList: React.FC<{
  column: DemoColumn;
  onToggleTask: (columnId: string, taskId: string) => void;
  onTaskDrop: (e: React.DragEvent, column: DemoColumn) => void;
}> = ({ column, onToggleTask, onTaskDrop }) => (
  <div
    className="task-list"
    data-droppable={column.id}
    onDragOver={(e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    }}
    onDrop={(e) => onTaskDrop(e, column)}
  >
    <AnimatePresence initial={false}>
      {column.tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          columnId={column.id}
          color="var(--bg2)"
          onToggleTask={onToggleTask}
          onDragStart={(e) => {
            e.dataTransfer.setData("text/task", task.id);
            e.dataTransfer.setData("text/column", column.id);
            e.dataTransfer.effectAllowed = "move";
            setScaledDragImage(e);
          }}
          onDragEnd={() => undefined}
        />
      ))}
    </AnimatePresence>
  </div>
);

const Column: React.FC<{
  column: DemoColumn;
  onToggleTask: (columnId: string, taskId: string) => void;
  onCreateTask: (columnId: string) => void;
  onColumnDrop: (e: React.DragEvent<HTMLDivElement>, column: DemoColumn) => void;
  onTaskDrop: (e: React.DragEvent, column: DemoColumn) => void;
}> = ({ column, onToggleTask, onCreateTask, onColumnDrop, onTaskDrop }) => (
  <motion.div className="task-main-block" layout>
    <ColumnHeader
      column={column}
      onCreateTask={() => onCreateTask(column.id)}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/column", column.id);
        e.dataTransfer.effectAllowed = "move";
        setScaledDragImage(e);
      }}
      onDragEnd={() => undefined}
    />
    <div
      className="task-block"
      data-column={column.id}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => onColumnDrop(e, column)}
    >
      <TaskList column={column} onToggleTask={onToggleTask} onTaskDrop={onTaskDrop} />
    </div>
  </motion.div>
);

const BoardsHeader: React.FC<{
  onCreateNewBoard: () => void;
  onToggleList: () => void;
}> = ({ onCreateNewBoard, onToggleList }) => (
  <div
    className="boards-list-header"
    style={{ height: "40px", minHeight: "40px", width: "100%" }}
  >
    <h3>BOARDS</h3>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <button
        className="tr_button centered_content"
        style={{ width: "40px", height: "40px", padding: "0px" }}
        onClick={onCreateNewBoard}
      >
        <i className="fa-solid fa-plus"></i>
      </button>
      <button
        className="tr_button centered_content"
        style={{ width: "40px", height: "40px", padding: "0px" }}
        onClick={onToggleList}
      >
        <i className="fa-solid fa-eye"></i>
      </button>
    </div>
  </div>
);

const BoardElement: React.FC<{
  board: DemoBoard;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onBoardDrop: (e: React.DragEvent<HTMLDivElement>, board: DemoBoard) => void;
}> = ({ board, isSelected, onSelect, onDragStart, onDragEnd, onBoardDrop }) => (
  <div
    draggable
    className={`board-element ${isSelected ? "selected" : ""}`}
    onClick={onSelect}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    onDragOver={(e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    }}
    onDrop={(e) => onBoardDrop(e, board)}
    style={{
      backgroundColor: isSelected ? "var(--accent-disabled)" : "transparent",
      color: isSelected ? "var(--accent)" : "var(--fg)",
      border: isSelected ? "3px solid var(--accent)" : "3px solid transparent",
      cursor: isSelected ? "auto" : "grab",
      userSelect: "none",
      textAlign: "left",
      margin: "5px 0",
      borderRadius: "var(--border-radius)",
      outline: "none",
      width: "calc(100% - var(--spacing-s))",
      padding: "0 0 0 var(--spacing-s)",
      height: "40px",
      display: "flex",
      alignItems: "center",
    }}
  >
    <h1 style={{ margin: 0, display: "flex", alignItems: "center" }}>
      <i className="fa-solid fa-folder" style={{ marginRight: "10px" }}></i>
      {board.title}
    </h1>
  </div>
);

const TasksTab: React.FC = () => {
  const [boards, setBoards] = useState<DemoBoard[]>(INITIAL_BOARDS);
  const [currentBoardId, setCurrentBoardId] = useState<string>(INITIAL_BOARDS[0].id);
  const [isBoardsListVisible, setIsBoardsListVisible] = useState(true);

  const currentBoard = boards.find((b) => b.id === currentBoardId) || boards[0];
  const columns = currentBoard?.columns ?? [];

  const updateBoard = (boardId: string, updater: (b: DemoBoard) => DemoBoard) => {
    setBoards((prev) => prev.map((b) => (b.id === boardId ? updater(b) : b)));
  };

  const createNewBoard = () => {
    const id = "board-" + Date.now();
    const board: DemoBoard = { id, title: "New Board " + (boards.length + 1), columns: [] };
    setBoards((prev) => [...prev, board]);
    setCurrentBoardId(id);
  };

  const createNewColumn = (boardId: string) => {
    updateBoard(boardId, (b) => ({
      ...b,
      columns: [...b.columns, { id: "col-" + Date.now(), title: "New Column", color: "var(--bg2)", tasks: [] }],
    }));
  };

  const createNewTask = (boardId: string, columnId: string) => {
    updateBoard(boardId, (b) => ({
      ...b,
      columns: b.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              tasks: [
                ...col.tasks,
                {
                  id: "t-" + Date.now(),
                  content: "New Task",
                  completed: false,
                  deadline: new Date().toISOString().slice(0, 10),
                },
              ],
            }
          : col,
      ),
    }));
  };

  const toggleTask = (boardId: string, columnId: string, taskId: string) => {
    updateBoard(boardId, (b) => ({
      ...b,
      columns: b.columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)) }
          : col,
      ),
    }));
  };

  const reorderColumns = (boardId: string, from: number, to: number) => {
    if (from === to) return;
    updateBoard(boardId, (b) => ({ ...b, columns: arrayMove(b.columns, from, to) }));
  };

  const moveTask = (
    boardId: string,
    srcColumnId: string,
    srcIndex: number,
    destColumnId: string,
    destIndex: number,
  ) => {
    updateBoard(boardId, (b) => {
      const columnsArr = [...b.columns];
      const src = columnsArr.find((c) => c.id === srcColumnId);
      const dest = columnsArr.find((c) => c.id === destColumnId);
      if (!src || !dest) return b;
      const srcTasks = [...src.tasks];
      const [removed] = srcTasks.splice(srcIndex, 1);
      if (!removed) return b;
      const destTasks = destColumnId === srcColumnId ? srcTasks : [...dest.tasks];
      if (destColumnId !== srcColumnId) {
        destTasks.splice(destIndex, 0, removed);
      } else {
        destTasks.splice(destIndex, 0, removed);
      }
      return {
        ...b,
        columns: columnsArr.map((c) =>
          c.id === srcColumnId
            ? { ...c, tasks: destColumnId === srcColumnId ? destTasks : srcTasks }
            : c.id === destColumnId
              ? { ...c, tasks: destTasks }
              : c,
        ),
      };
    });
  };

  const handleTaskDrop = (e: React.DragEvent, column: DemoColumn) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/task");
    const srcColumnId = e.dataTransfer.getData("text/column");
    if (!taskId || !srcColumnId) return;

    const srcColumn = columns.find((c) => c.id === srcColumnId);
    const srcIndex = srcColumn ? srcColumn.tasks.findIndex((t) => t.id === taskId) : -1;
    if (srcIndex === -1) return;

    const destIndex = indexOfChildAtPoint(e.currentTarget as HTMLElement, e.clientY, "y");
    const destColumn = column;
    let finalIndex = destIndex;
    // if dropping within the same column after the source, account removal
    if (destColumn.id === srcColumnId && srcIndex < destIndex) finalIndex -= 1;

    moveTask(currentBoardId, srcColumnId, srcIndex, destColumn.id, finalIndex);
  };

  const handleColumnDrop = (e: React.DragEvent<HTMLDivElement>, column: DemoColumn) => {
    e.preventDefault();
    const columnId = e.dataTransfer.getData("text/column");
    if (!columnId) return;
    const fromIndex = columns.findIndex((c) => c.id === columnId);
    if (fromIndex === -1) return;
    const kanban = (e.currentTarget as HTMLElement).closest(".kanbanview") as HTMLElement | null;
    const toIndex = columnSlotIndex(kanban, e.clientX);
    reorderColumns(currentBoardId, fromIndex, toIndex);
  };

  const handleBoardDrop = (e: React.DragEvent<HTMLDivElement>, targetBoard: DemoBoard) => {
    e.preventDefault();
    const boardId = e.dataTransfer.getData("text/board");
    if (!boardId) return;
    const fromIndex = boards.findIndex((b) => b.id === boardId);
    if (fromIndex === -1) return;
    const toIndex = indexOfChildAtPoint(e.currentTarget.parentElement, e.clientY, "y");
    let finalTo = toIndex;
    if (fromIndex < finalTo) finalTo -= 1;
    setBoards((prev) => arrayMove(prev, fromIndex, finalTo));
  };

  return (
    <div className="tab-content" id="tasks_block">
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {isBoardsListVisible && (
          <div className="boards-list">
            <BoardsHeader onCreateNewBoard={createNewBoard} onToggleList={() => setIsBoardsListVisible(false)} />
            <div data-droppable="boards">
              {boards.map((board) => (
                <BoardElement
                  key={board.id}
                  board={board}
                  isSelected={board.id === currentBoardId}
                  onSelect={() => setCurrentBoardId(board.id)}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/board", board.id);
                    e.dataTransfer.effectAllowed = "move";
                    setScaledDragImage(e);
                  }}
                  onDragEnd={() => undefined}
                  onBoardDrop={handleBoardDrop}
                />
              ))}
            </div>
            <button className="menu_button" style={{ marginTop: "var(--spacing-m)" }} onClick={createNewBoard}>
              <i className="fa-solid fa-plus"></i> New board
            </button>
          </div>
        )}

        <div
          className="kanbanview"
          style={{ flex: 1, width: "auto", maxWidth: "none", minWidth: 0 }}
          data-droppable="kanban"
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={(e) => {
            const columnId = e.dataTransfer.getData("text/column");
            if (columnId) {
              const fromIndex = columns.findIndex((c) => c.id === columnId);
              if (fromIndex !== -1) {
                const kanban = e.currentTarget as HTMLElement;
                if (kanban) {
                  const toIndex = columnSlotIndex(kanban, e.clientX);
                  reorderColumns(currentBoardId, fromIndex, toIndex);
                }
              }
            }
          }}
        >
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onToggleTask={(columnId, taskId) => toggleTask(currentBoardId, columnId, taskId)}
              onCreateTask={(columnId) => createNewTask(currentBoardId, columnId)}
              onColumnDrop={handleColumnDrop}
              onTaskDrop={handleTaskDrop}
            />
          ))}
          <motion.div
            className="task-main-block mini-task-main-block"
            style={{ flex: "0 0 220px", width: 220, alignSelf: "flex-start", minHeight: 200 }}
          >
            <button
              className="tr_button task-add-column centered_content"
              style={{ textAlign: "center", height: "100%", maxHeight: "600px", minHeight: "200px" }}
              onClick={() => createNewColumn(currentBoardId)}
            >
              <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />
            </button>
          </motion.div>
        </div>
      </div>
      {!isBoardsListVisible && (
        <button
          className="floating-button"
          onClick={() => setIsBoardsListVisible(true)}
          title="Show boards list"
        >
          <i className="fa-solid fa-list"></i>
        </button>
      )}
    </div>
  );
};

/* ------------------------------ Projects tab --------------------------------- */

export interface DemoProject {
  id: string;
  title: string;
  created_at: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
  status: string;
  about?: string;
  link_to?: string;
  board_id?: string;
}

const INITIAL_PROJECTS: DemoProject[] = [
  {
    id: "p1",
    title: "Launcher v2.0",
    created_at: "Mar 04",
    deadline: "2026-08-15",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "p2",
    title: "Analytics pipeline",
    created_at: "May 22",
    deadline: "2026-09-01",
    priority: "Low",
    status: "On Hold",
  },
  {
    id: "p3",
    title: "Mobile companion",
    created_at: "Jun 11",
    deadline: "2026-11-20",
    priority: "Medium",
    status: "Planned",
  },
  {
    id: "p4",
    title: "Team workspace",
    created_at: "Apr 17",
    deadline: "2026-06-30",
    priority: "Medium",
    status: "Completed",
  },
];

const ProjectCard: React.FC<{
  project: DemoProject;
  index: number;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onOpen: () => void;
}> = ({ project, index, onDragStart, onDragEnd, onOpen }) => {
  const ddl = new Date(project.deadline);
  const days = Math.ceil((ddl.getTime() - Date.now()) / (1000 * 3600 * 24));

  return (
    <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd} style={{ cursor: "grab" }}>
      <motion.div
        className="project_block"
        role="button"
        tabIndex={0}
        aria-label={`Project: ${project.title}`}
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: (index % 4) * 0.08 }}
        onMouseDown={(e) => {
          if (e.button !== 0) return;
          const startX = e.clientX;
          const startY = e.clientY;
          const clear = () => {
            window.removeEventListener("mouseup", up);
            window.removeEventListener("mousemove", move);
          };
          const move = (ev: MouseEvent) => {
            if (Math.abs(ev.clientX - startX) > 5 || Math.abs(ev.clientY - startY) > 5) clear();
          };
          const up = (ev: MouseEvent) => {
            if (Math.abs(ev.clientX - startX) < 5 && Math.abs(ev.clientY - startY) < 5) onOpen();
            clear();
          };
          window.addEventListener("mousemove", move);
          window.addEventListener("mouseup", up);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
      >
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--spacing-l)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "auto",
            justifyContent: "center",
            gap: "var(--spacing-l)",
          }}
        >
          <input
            className="project_title_input"
            placeholder="Project title"
            value={project.title}
            readOnly
            style={{
              fontWeight: "600",
              border: "none",
              outline: "none",
              width: "100%",
              margin: "0px",
              padding: "0px",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "auto",
              gap: "var(--spacing-s)",
              flexDirection: "column",
              textAlign: "left",
            }}
          >
            <strong style={{ fontSize: "var(--text-base)", opacity: "0.7" }}>
              Created: {project.created_at}
            </strong>
            <strong
              style={{
                fontSize: "var(--text-base)",
                opacity: "0.7",
                display: "flex",
                gap: "var(--spacing-s)",
              }}
            >
              DDL: {project.deadline}{" "}
              <span style={{ fontSize: "var(--text-base)", opacity: "1" }}>
                ({days} days)
              </span>
            </strong>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "auto",
            justifyContent: "center",
            alignItems: "center",
            gap: "var(--spacing-l)",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "space-between",
              gap: "var(--spacing-s)",
            }}
          >
            <div
              className="centered_content"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "var(--spacing-s)",
                fontSize: "var(--text-lg)",
              }}
            >
              <i
                className="fa-solid fa-flag"
                style={{ fontSize: "var(--text-lg)" }}
              ></i>{" "}
              Priority:
            </div>
            <div className="spacer" style={{ width: "var(--spacing-s)" }} />
            <span
              className={`centered_content project_priority priority-${project.priority.toLowerCase()}`}
              style={{ backgroundColor: getPriorityColor(project.priority) }}
            >
              {project.priority}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "space-between",
              gap: "var(--spacing-s)",
            }}
          >
            <div
              className="centered_content"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "var(--spacing-s)",
                fontSize: "var(--text-lg)",
              }}
            >
              <i
                className="fa-solid fa-hourglass-start"
                style={{ fontSize: "var(--text-lg)" }}
              ></i>{" "}
              Status:
            </div>
            <div className="spacer" style={{ width: "var(--spacing-s)" }} />
            <span
              className={`project_status centered_content status-${project.status.replace(/\s/g, "")}`}
              style={{ backgroundColor: getStatusColor(project.status) }}
            >
              {project.status}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
    </div>
  );
};

/* getStatusColor() from Projects/projectStatuses.ts of the app */
const getStatusColor = (status: string): string => {
  switch (status) {
    case "Planned":
      return "var(--purple)";
    case "Completed":
      return "var(--green)";
    case "In Progress":
      return "var(--blue)";
    case "On Hold":
      return "var(--yellow)";
    case "Cancelled":
      return "var(--red)";
    default:
      return "var(--fg)";
  }
};

/* getPriorityColor() from Projects/ProjectModal.tsx of the app */
const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case "high":
      return "var(--red)";
    case "medium":
      return "var(--yellow)";
    case "low":
      return "var(--green)";
    default:
      return "var(--fg)";
  }
};

/* DemoSelect: the app uses native <select> elements, but inside the CSS-scaled
   demo Chromium renders the native dropdown popup at unscaled size (~1.8x too
   big). This replacement keeps the same look and opens a scaled popup inside
   the demo (portaled to .owl-demo so scoped styles apply). */
const DemoSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; disabled?: boolean; color?: string }[];
  placeholder?: string;
  className?: string;
  triggerStyle?: React.CSSProperties;
  ariaLabel?: string;
}> = ({ value, onChange, options, placeholder, className = "", triggerStyle, ariaLabel }) => {
  const [open, setOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [pos, setPos] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [highlight, setHighlight] = useState(-1);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value && !o.disabled);
  const visibleOptions = options.filter((o) => !o.disabled);

  const computePos = (): { left: number; top: number; width: number; height: number } | null => {
    const trigger = triggerRef.current;
    if (!trigger) return null;
    const demo = trigger.closest(".owl-demo") as HTMLElement | null;
    if (!demo) return null;
    let left = 0;
    let top = 0;
    let el: HTMLElement | null = trigger;
    while (el && el !== demo) {
      left += el.offsetLeft;
      top += el.offsetTop;
      el = el.offsetParent as HTMLElement | null;
    }
    const estH = Math.min(visibleOptions.length * 34 + 8, 240);
    const flip = top + trigger.offsetHeight + 4 + estH > demo.clientHeight;
    return {
      left,
      top: flip ? top - estH - 4 : top + trigger.offsetHeight + 4,
      width: trigger.offsetWidth,
      height: estH,
    };
  };

  const openPopup = () => {
    const p = computePos();
    if (!p) return;
    const demo = triggerRef.current?.closest(".owl-demo") as HTMLElement | null;
    setPortalTarget(demo);
    setPos(p);
    setHighlight(-1);
    setOpen(true);
  };

  const choose = useCallback(
    (opt: { value: string }) => {
      onChange(opt.value);
      setOpen(false);
    },
    [onChange],
  );

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || popupRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        /* consume the event so other document listeners (e.g. the modal's
           Escape handler) don't also react to it */
        e.stopImmediatePropagation();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const step = (h: number) => {
          for (let i = 1; i <= visibleOptions.length; i++) {
            const n = (h + i) % visibleOptions.length;
            if (!visibleOptions[n].disabled) return n;
          }
          return h;
        };
        setHighlight((h) => step(h < 0 ? -1 : h));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const step = (h: number) => {
          for (let i = 1; i <= visibleOptions.length; i++) {
            const n = (h - i + visibleOptions.length) % visibleOptions.length;
            if (!visibleOptions[n].disabled) return n;
          }
          return h;
        };
        setHighlight((h) => (h < 0 ? step(-1) : step(h)));
      } else if (e.key === "Enter" && highlight >= 0 && visibleOptions[highlight]) {
        choose(visibleOptions[highlight]);
      }
    };
    const onScroll = () => setOpen(false);
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("wheel", onScroll, { capture: true });
    document.addEventListener("touchmove", onScroll, { capture: true });
    return () => {
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("wheel", onScroll, { capture: true });
      document.removeEventListener("touchmove", onScroll, { capture: true });
    };
  }, [open, highlight, visibleOptions, choose]);

  return (
    <div
      ref={triggerRef}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-haspopup="listbox"
      aria-expanded={open}
      className={`demo-select ${className}`}
      style={triggerStyle}
      onClick={(e) => {
        /* the popup is a React portal child of the trigger, so clicks on
           popup options bubble through the trigger's onClick and would
           reopen the closed popup — ignore clicks from inside the popup */
        if (popupRef.current && popupRef.current.contains(e.target as Node)) return;
        openPopup();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (open) setOpen(false);
          else openPopup();
        }
      }}
    >
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {selected ? selected.label : placeholder ?? ""}
      </span>
      <i className="fa-solid fa-caret-down demo-select-caret"></i>
      {open && portalTarget
        ? createPortal(
            <div
              ref={popupRef}
              className="demo-select-popup"
              role="listbox"
              onClick={(e) => {
                /* the popup is a React portal child of the trigger, so clicks
                   inside it bubble through the trigger AND up into the modal
                   overlay (which would close the modal) — stop them here */
                e.stopPropagation();
              }}
              style={{ left: pos.left, top: pos.top, width: pos.width, maxHeight: pos.height }}
            >
              {options.map((opt) => (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  className={`demo-select-option${opt.disabled ? " disabled" : ""}${!opt.disabled && visibleOptions[highlight] === opt ? " highlighted" : ""}`}
                  style={opt.color ? { color: opt.color } : undefined}
                  onClick={() => {
                    if (!opt.disabled) choose(opt);
                  }}
                  onMouseEnter={() => {
                    if (!opt.disabled) setHighlight(visibleOptions.indexOf(opt));
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>,
            portalTarget,
          )
        : null}
    </div>
  );
};

const ProjectsHeader: React.FC<{
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSortChange: (v: string) => void;
  onToggleDirection: () => void;
  onAddProject: () => void;
}> = ({ sortBy, sortDirection, onSortChange, onToggleDirection, onAddProject }) => (
  <div
    className="tab_header_content"
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--spacing-s)",
      height: "45px",
    }}
  >
    <DemoSelect
      className="sort_selector"
      value={sortBy}
      onChange={onSortChange}
      ariaLabel="Sort projects"
      triggerStyle={{
        width: "auto",
        maxWidth: "400px",
        minWidth: "140px",
        height: "45px",
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
      options={[
        { value: "", label: "No sorting" },
        { value: "status", label: "Sort by status" },
        { value: "priority", label: "Sort by priority" },
        { value: "deadline", label: "Sort by deadline" },
      ]}
    />
    <button
      className="button centered_content"
      style={{
        width: "35px",
        height: "45px",
        aspectRatio: "1/1",
        padding: "0px",
        margin: "0px",
        backgroundColor: "transparent",
        boxShadow: "none",
        textAlign: "center",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onToggleDirection}
    >
      {sortDirection === "asc" ? (
        <i
          className="fa-solid fa-arrow-up centered_content"
          style={{
            width: "35px",
            height: "45px",
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            padding: "0px",
            margin: "0px",
            backgroundColor: "transparent",
          }}
        ></i>
      ) : (
        <i
          className="fa-solid fa-arrow-down centered_content"
          style={{
            width: "35px",
            height: "45px",
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            padding: "0px",
            margin: "0px",
            backgroundColor: "transparent",
          }}
        ></i>
      )}
    </button>
    <button
      className="button centered_content"
      id="create_project_card"
      style={{
        width: "35px",
        height: "45px",
        aspectRatio: "1/1",
        textAlign: "center",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        padding: "0px",
        margin: "0px",
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
      onClick={onAddProject}
    >
      <i
        className="fa-solid fa-plus centered_content"
        style={{
          width: "35px",
          height: "45px",
          display: "flex",
          flexDirection: "column",
        }}
      ></i>
    </button>
  </div>
);

/* ProjectModal from Projects/ProjectModal.tsx of the app (api calls and
   i18n replaced with local demo state and plain labels) */
const PROJECT_STATUSES = ["Planned", "In Progress", "On Hold", "Completed", "Cancelled"];

const DemoInputField: React.FC<{
  label: string;
  as?: "input" | "textarea";
  className?: string;
  value?: string;
  name?: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> = ({ label, as = "input", className = "", value = "", name, type, onChange }) => {
  const Component = as === "textarea" ? "textarea" : "input";
  return (
    <Component
      {...({ name, value, onChange, type } as object)}
      style={{ width: "100%" }}
      className={`input-field ${className}`}
      placeholder={label}
    />
  );
};

const ProjectTasksProgress: React.FC<{ boardId: string }> = ({ boardId }) => {
  const board = INITIAL_BOARDS.find((b) => b.id === boardId);
  const allTasks = board ? board.columns.flatMap((col) => col.tasks) : [];
  const progress = allTasks.length === 0 ? 0 : (allTasks.filter((t) => t.completed).length / allTasks.length) * 100;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        textAlign: "center",
        gap: "var(--spacing-m)",
        width: "auto",
      }}
    >
      <div
        style={{
          width: "45px",
          height: "45px",
          maxWidth: "45px",
          padding: "0px",
          margin: "0px",
          maxHeight: "45px",
        }}
      >
        <CircularProgressBar
          size={50}
          strokeWidth={10}
          progress={progress}
          progressColor={"var(--green)"}
        />
      </div>
    </div>
  );
};

const ProjectModal: React.FC<{
  project: DemoProject;
  onSave: (p: DemoProject) => void;
  onClose: () => void;
}> = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState<DemoProject>({
    id: project.id,
    title: project.title || "",
    about: project.about || "",
    deadline: project.deadline || new Date().toISOString().split("T")[0],
    status: project.status || PROJECT_STATUSES[0],
    link_to: project.link_to || "",
    priority: project.priority || "Low",
    board_id: project.board_id || "0",
    created_at: project.created_at || new Date().toISOString(),
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const statusColor = getStatusColor(formData.status);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        /* a select popup is open — let it close itself, don't close the modal */
        if (document.querySelector(".owl-demo .demo-select-popup")) return;
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      style={{ userSelect: "none" }}
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="project-modal-content"
        ref={contentRef}
        style={{ width: "calc(80% - var(--spacing-xxl) - var(--spacing-xxl))" }}
        initial={{ opacity: 0, y: -200 }}
        exit={{ opacity: 0, y: -200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <DemoInputField
            label="Project title"
            value={formData.title}
            name="title"
            onChange={handleChange}
            className="project_title"
          />
          <ProjectTasksProgress boardId={formData.board_id ?? "0"} />
        </div>
        <div className="spacer" style={{ height: "20px" }}></div>
        <div className="project-modal-subcontent">
          <div className="project-editor-content">
            <div className="project_content_sub_block">
              <label>
                <i className="fa-solid fa-check-double"></i> Board
              </label>
              <DemoSelect
                value={formData.board_id ?? ""}
                onChange={(v) => setFormData((prev) => ({ ...prev, board_id: v }))}
                ariaLabel="Project board"
                placeholder="SELECT BOARD"
                triggerStyle={{ width: "200px", height: "40px", backgroundColor: "transparent", boxShadow: "none" }}
                options={[
                  { value: "", label: "SELECT BOARD", disabled: true },
                  ...INITIAL_BOARDS.map((board) => ({ value: board.id, label: board.title })),
                ]}
              />
            </div>
            <div className="project_content_sub_block">
              <label>
                <i className="fa-solid fa-paperclip"></i> Link
              </label>
              <DemoInputField
                className="project_link_to_source"
                label="Type... "
                name="link_to"
                value={formData.link_to}
                onChange={handleChange}
              />
            </div>
            <div className="project_content_sub_block">
              <label>
                <i className="fa-regular fa-clock"></i> Deadline:{" "}
              </label>
              <DemoInputField
                className="project_deadline project_deadline_modal"
                label="Deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
            <div className="project_content_sub_block">
              <label>
                <i className="fa-solid fa-chart-simple"></i> Status
              </label>
              <DemoSelect
                value={formData.status}
                onChange={(v) => setFormData((prev) => ({ ...prev, status: v }))}
                ariaLabel="Project status"
                placeholder="Select status"
                triggerStyle={{
                  color: statusColor,
                  width: "200px",
                  height: "40px",
                  textAlign: "left",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
                options={[
                  { value: "", label: "Select status", disabled: true },
                  ...PROJECT_STATUSES.map((status) => ({
                    value: status,
                    label: status,
                    color: getStatusColor(status),
                  })),
                ]}
              />
            </div>
            <div className="project_content_sub_block">
              <label>
                <i className="fa-solid fa-brain"></i> Priority
              </label>
              <DemoSelect
                value={formData.priority}
                onChange={(v) => setFormData((prev) => ({ ...prev, priority: v as DemoProject["priority"] }))}
                ariaLabel="Project priority"
                triggerStyle={{
                  width: "200px",
                  height: "40px",
                  color: getPriorityColor(formData.priority),
                  textAlign: "left",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
                options={(["Low", "Medium", "High"] as const).map((priority) => ({
                  value: priority,
                  label: priority,
                  color: getPriorityColor(priority),
                }))}
              />
            </div>
            <div className="spacer" style={{ height: "5px" }}></div>
            <div className="spacer" style={{ height: "5px", backgroundColor: "var(--bg2)", width: "70%" }}></div>
            <div className="spacer" style={{ height: "5px" }}></div>
          </div>
        </div>
        <DemoInputField
          label="About project"
          as="textarea"
          value={formData.about}
          name="about"
          onChange={handleChange}
          className="project_info_editor"
        />
        <div className="modal-actions">
          <button className="button" id="green" onClick={handleSave} style={{ width: "60%" }}>
            <i className="fa-solid fa-sd-card"></i> Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectsTab: React.FC = () => {
  const [projects, setProjects] = useState<DemoProject[]>(INITIAL_PROJECTS);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editingProject, setEditingProject] = useState<DemoProject | null>(null);

  const sortedProjects = useMemo(() => {
    if (!sortBy) return [...projects];

    const sortedDev = [...projects].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "status") {
        const statusOrder = ["Planned", "In Progress", "Completed"];
        comparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      } else if (sortBy === "priority") {
        const priorityOrder = ["low", "medium", "high"];
        comparison =
          priorityOrder.indexOf(a.priority.toLowerCase()) -
          priorityOrder.indexOf(b.priority.toLowerCase());
      } else if (sortBy === "deadline") {
        comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sortedDev;
  }, [projects, sortBy, sortDirection]);

  const handleAddProject = () => {
    const newProject: DemoProject = {
      id: "p-" + Date.now(),
      title: "New Project",
      created_at: new Date().toISOString().slice(5, 10),
      deadline: new Date().toISOString().slice(0, 10),
      priority: "Low",
      status: "Planned",
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const handleReorder = (from: number, to: number) => {
    if (from === to) return;
    setProjects((prev) => arrayMove(prev, from, to));
    setSortBy("");
  };

  return (
    <div className="tab-content">
      <ProjectsHeader
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={setSortBy}
        onToggleDirection={() =>
          setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
        }
        onAddProject={handleAddProject}
      />
      <div
        className="projects_list"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          const projectId = e.dataTransfer.getData("text/project");
          if (!projectId) return;
          const fromIndex = sortedProjects.findIndex((p) => p.id === projectId);
          if (fromIndex === -1) return;
          const toIndex = indexOfChildAtPoint(e.currentTarget as HTMLElement, e.clientY, "y");
          let finalTo = toIndex;
          if (fromIndex < finalTo) finalTo -= 1;
          handleReorder(fromIndex, finalTo);
        }}
      >
        {sortedProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/project", project.id);
              e.dataTransfer.effectAllowed = "move";
              setScaledDragImage(e);
            }}
            onDragEnd={() => undefined}
            onOpen={() => setEditingProject(project)}
          />
        ))}
      </div>
      <AnimatePresence>
        {editingProject && (
          <ProjectModal
            project={editingProject}
            onSave={(updated) =>
              setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
            }
            onClose={() => setEditingProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ------------------------------- Stats tab --------------------------------- */

const StatisticTab: React.FC = () => (
  <div className="tab-content" id="stats_block">
    <div className="stats_content">
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="stats_grid">
          <div className="grid-tasks-chart">
            <TasksChartBlock />
          </div>
          <div className="grid-projects-chart">
            <ProjectsChartBlock />
          </div>
          <TotalProjectsBlock />
          <DeadlineProjectsBlock />
          <TodayTasksBlock />
          <DaysActivityBlock />
          <TasksProgressBlock />
          <LongestStreakBlock />
        </div>
      </div>
    </div>
  </div>
);

/* ------------------------------ App shell ----------------------------------- */

export type AppDemoProps = { defaultTab?: TabId };

export const AppDemo: React.FC<AppDemoProps> = ({ defaultTab = "home" }) => {
  const [activeTab] = useState<TabId>(defaultTab);
  const [mounted, setMounted] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const renderActiveTab = (): ReactElement => {
    switch (activeTab) {
      case "home":
        return <WelcomeTab />;
      case "tasks":
        return <TasksTab />;
      case "projects":
        return <ProjectsTab />;
      case "stats":
        return <StatisticTab />;
    }
  };

  return (
    <div className="owl-demo-frame" ref={frameRef}>
      <div className="owl-demo">
        {mounted ? (
          <>
            <NavBar activeTab={activeTab} onTabChange={() => undefined} />
            <div className="owl-demo-body">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  {renderActiveTab()}
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div
            className="owl-demo-placeholder"
            style={{ width: "1000px", height: "1000px" }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
};
