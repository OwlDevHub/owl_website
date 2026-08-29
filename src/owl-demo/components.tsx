import { type ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Chart from "chart.js/auto";
import { MarkdownEditor } from "./MarkdownEditor";
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

type TabId = "home" | "tasks" | "projects" | "stats" | "account" | "settings";

const TABS: Record<TabId, string> = {
  home: "Home",
  tasks: "Tasks",
  projects: "Projects",
  stats: "Statistics",
  account: "Account",
  settings: "Settings",
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
  style?: React.CSSProperties;
}> = ({
  progress = 0,
  size = 160,
  strokeWidth = 12,
  trackColor = "var(--bg3)",
  progressColor = "var(--accent)",
  style,
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
      style={{ transform: "rotate(-90deg)", ...style }}
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
    { id: "account", icon: "fa-user", text: TABS.account },
    { id: "settings", icon: "fa-gear", text: TABS.settings },
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
          position: "fixed",
          right: "var(--spacing-m)",
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

/* Calendar from Welcome/Widgets.tsx of the app: month/year navigation and a
   tooltip on day click listing the upcoming tasks (deadline >= that day). */
interface DemoCalendarTask {
  id: string;
  content: string;
  deadline: string;
  completed: boolean;
}

const Calendar: React.FC<{ tasks?: DemoCalendarTask[] }> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [clickedDay, setClickedDay] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handlePrevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const handlePrevYear = () =>
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth()));
  const handleNextYear = () =>
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth()));

  const handleDateClick = (day: number) =>
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));

  const renderWeekdayHeaders = () =>
    weekDays.map((d, i) => (
      <div
        key={`weekday-${i}`}
        style={{
          fontSize: "var(--text-xs)",
          opacity: 0.4,
          color: "var(--fg)",
          textAlign: "center",
          fontWeight: 600,
          padding: "2px 0",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {d}
      </div>
    ));

  const renderEmptyCells = () =>
    Array.from({ length: firstDayOfMonth }).map((_, i) => (
      <div key={`empty-${i}`} />
    ));

  const getTasksForDay = (day: number): DemoCalendarTask[] => {
    if (!tasks) return [];
    const targetDateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    )
      .toISOString()
      .split("T")[0];
    const tasksForDay = tasks.filter((task) => {
      const taskDeadline = new Date(task.deadline).toISOString().split("T")[0];
      return taskDeadline >= targetDateStr;
    });
    const sortedTasks = [...tasksForDay].sort((a, b) => {
      const dateA = new Date(a.deadline).toISOString().split("T")[0];
      const dateB = new Date(b.deadline).toISOString().split("T")[0];
      if (dateA === targetDateStr && dateB !== targetDateStr) return -1;
      if (dateA !== targetDateStr && dateB === targetDateStr) return 1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
    return sortedTasks.slice(0, 5);
  };

  const renderDayCells = () =>
    Array.from({ length: daysInMonth }).map((_, dayIndex) => {
      const day = dayIndex + 1;
      const isSelected =
        selectedDate?.getDate() === day &&
        selectedDate?.getMonth() === currentDate.getMonth() &&
        selectedDate?.getFullYear() === currentDate.getFullYear();
      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();
      const backgroundColor = isSelected || isToday ? "var(--accent)" : "transparent";
      const textColor = isSelected || isToday ? "var(--bg)" : "var(--fg)";
      return (
        <button
          key={`day-${day}`}
          className="calendar-day centered_content"
          onClick={(e) => {
            if (clickedDay === day) {
              setClickedDay(null);
              setTooltipPosition(null);
            } else {
              handleDateClick(day);
              if (!containerRef.current) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const containerRect = containerRef.current.getBoundingClientRect();
              setClickedDay(day);
              setTooltipPosition({
                x: rect.left - containerRect.left,
                y: rect.top - containerRect.top,
              });
            }
          }}
          aria-label={`Select date ${day} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          style={{
            padding: "4px",
            backgroundColor,
            color: textColor,
            fontWeight: isToday ? 700 : 500,
            transition: "background 0.2s, color 0.2s",
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
          {day}
        </button>
      );
    });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setClickedDay(null);
        setTooltipPosition(null);
        setSelectedDate(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navBtnStyle = {
    height: 28,
    width: 28,
    borderRadius: "var(--border-radius)",
    color: "var(--fg)",
    padding: "0px",
    margin: "0px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.15s",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    fontSize: "var(--text-md)",
  };
  const onNavEnter = (e: React.MouseEvent<HTMLButtonElement>) =>
    (e.currentTarget.style.backgroundColor = "var(--bg3)");
  const onNavLeave = (e: React.MouseEvent<HTMLButtonElement>) =>
    (e.currentTarget.style.backgroundColor = "transparent");

  return (
    <div
      ref={containerRef}
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
          height: "40px",
        }}
      >
        <div style={{ display: "flex", gap: "2px" }}>
          <button
            className="button"
            style={navBtnStyle}
            onMouseEnter={onNavEnter}
            onMouseLeave={onNavLeave}
            onClick={handlePrevYear}
            title="Previous Year"
          >
            <i className="fa-solid fa-angles-left" />
          </button>
          <button
            className="button"
            style={navBtnStyle}
            onMouseEnter={onNavEnter}
            onMouseLeave={onNavLeave}
            onClick={handlePrevMonth}
            title="Previous Month"
          >
            <i className="fa-solid fa-angle-left" />
          </button>
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: "var(--text-md)",
            fontWeight: 600,
            minWidth: "120px",
            textAlign: "center",
            color: "var(--fg)",
          }}
        >
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div style={{ display: "flex", gap: "2px" }}>
          <button
            className="button"
            style={navBtnStyle}
            onMouseEnter={onNavEnter}
            onMouseLeave={onNavLeave}
            onClick={handleNextMonth}
            title="Next Month"
          >
            <i className="fa-solid fa-angle-right" />
          </button>
          <button
            className="button"
            style={navBtnStyle}
            onMouseEnter={onNavEnter}
            onMouseLeave={onNavLeave}
            onClick={handleNextYear}
            title="Next Year"
          >
            <i className="fa-solid fa-angles-right" />
          </button>
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

      {clickedDay !== null && tooltipPosition && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            position: "absolute",
            left: tooltipPosition.x - 100 + 5,
            top: tooltipPosition.y - 40,
            transform: "translateY(-100%)",
            backgroundColor: "var(--surface-popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--border-radius)",
            padding: "var(--spacing-m)",
            boxShadow: "var(--shadow)",
            zIndex: 1000,
            minWidth: "200px",
            maxWidth: "300px",
            maxHeight: "300px",
            overflowY: "auto",
            gap: "var(--spacing-s)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "var(--text-md)", marginBottom: "2px" }}>
            {clickedDay} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          {getTasksForDay(clickedDay).length === 0 ? (
            <div style={{ opacity: 0.4, fontSize: "var(--text-xs)" }}>No tasks</div>
          ) : (
            getTasksForDay(clickedDay).map((task) => (
              <div
                key={task.id}
                style={{
                  padding: "4px 0",
                  borderBottom: "1px solid var(--border-light)",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "var(--spacing-s)",
                  fontSize: "var(--text-md)",
                }}
              >
                <input type="checkbox" className="checkbox" checked={task.completed} readOnly />
                {task.content}
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};

const CalendarWidget: React.FC<{ tasks?: DemoCalendarTask[] }> = ({ tasks }) => (
  <div
    className="widget_block"
    id="calendar-widget"
    style={{
      padding: "var(--spacing-xl)",
      margin: "0px",
      justifyContent: "flex-start",
      alignItems: "center",
      zIndex: "50",
      overflow: "visible",
      position: "relative",
      gridColumn: 2,
      gridRow: "1 / span 2",
      boxSizing: "border-box",
    }}
  >
    <Calendar tasks={tasks} />
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

/* ActivityGraph from Welcome/Widgets.tsx of the app: Github-style contribution
   heatmap. The demo feeds it a synthetic Map<date, count> (no backend). */
function buildDemoActivityCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  const year = new Date().getFullYear();
  let seed = 7;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let d = 0; d < 365; d++) {
    const date = new Date(year, 0, 1);
    date.setDate(date.getDate() + d);
    if (date > new Date()) continue;
    if (d % 3 === 0 || (d > 240 && d % 2 === 0)) {
      counts.set(date.toLocaleDateString("en-CA"), 1 + Math.floor(rand() * 9));
    }
  }
  return counts;
}

const ActivityGraph: React.FC<{ activityCounts?: Map<string, number> }> = ({
  activityCounts,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number; x: number; y: number } | null>(null);
  const [tooltipCoords, setTooltipCoords] = useState<{ left: number; top: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const repositionTooltip = useCallback(() => {
    if (!hoveredCell) return;
    const tipRect = tooltipRef.current?.getBoundingClientRect();
    const margin = 10;
    const tipWidth = tipRect?.width ?? 0;
    const tipHeight = tipRect?.height ?? 0;
    const left = Math.max(margin, Math.min(hoveredCell.x - tipWidth / 2, window.innerWidth - tipWidth - margin));
    let top = hoveredCell.y - tipHeight - margin;
    if (top < margin) top = hoveredCell.y + margin;
    top = Math.min(top, window.innerHeight - tipHeight - margin);
    setTooltipCoords({ left, top });
  }, [hoveredCell]);

  useEffect(() => repositionTooltip(), [repositionTooltip]);

  const CELL_SIZE = 13;
  const CELL_GAP = 5;

  const activityData = activityCounts || new Map<string, number>();
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 0, 1);
  const endDate = new Date(today.getFullYear(), 11, 31);
  const maxCount = Math.max(1, ...Array.from(activityData.values()));

  const weeks: { date: Date; count: number }[][] = [];
  let currentWeek: { date: Date; count: number }[] = [];
  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    const dateStr = cursor.toLocaleDateString("en-CA");
    const count = activityData.get(dateStr) || 0;
    currentWeek.push({ date: new Date(cursor), count });
    if (cursor.getDay() === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const getOpacity = (count: number): number => {
    if (count === 0) return 0.08;
    return 0.2 + (count / maxCount) * 0.8;
  };

  const monthLabels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstDay = week[0]?.date;
    if (firstDay) {
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ label: firstDay.toLocaleString("en-US", { month: "short" }), weekIndex: i });
        lastMonth = month;
      }
    }
  });

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div
      className="widget_block activity-graph"
      style={{
        gridColumn: "1 / -1",
        padding: "var(--spacing-l)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{ overflowX: "auto", overflowY: "hidden", width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `24px repeat(${weeks.length}, ${CELL_SIZE}px)`,
            gridTemplateRows: `auto repeat(7, ${CELL_SIZE}px)`,
            gap: CELL_GAP,
            minWidth: "fit-content",
            position: "relative",
          }}
        >
          {monthLabels.map((m, i) => (
            <div
              key={`month-${i}`}
              style={{
                gridColumn: `${m.weekIndex + 2} / span ${monthLabels[i + 1] ? monthLabels[i + 1].weekIndex - m.weekIndex : weeks.length - m.weekIndex}`,
                gridRow: 1,
                fontSize: "var(--text-xs)",
                opacity: 0.4,
                color: "var(--fg)",
              }}
            >
              {m.label}
            </div>
          ))}
          {dayLabels.map((label, i) => (
            <div
              key={`day-label-${i}`}
              style={{
                gridColumn: 1,
                gridRow: i + 2,
                fontSize: "var(--text-xs)",
                opacity: 0.4,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                color: "var(--fg)",
                paddingRight: 4,
              }}
            >
              {label}
            </div>
          ))}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              const isToday = day.date.toLocaleDateString("en-CA") === today.toLocaleDateString("en-CA");
              return (
                <div
                  key={`${wi}-${di}`}
                  style={{
                    gridColumn: wi + 2,
                    gridRow: di + 2,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    borderRadius: 2,
                    backgroundColor: "var(--accent)",
                    opacity: getOpacity(day.count),
                    cursor: "default",
                    transition: "opacity 0.15s",
                    outline: isToday ? "1.5px solid var(--fg)" : "none",
                    outlineOffset: 1,
                  }}
                  onMouseEnter={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    setHoveredCell({
                      date: day.date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
                      count: day.count,
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2,
                    });
                  }}
                  onMouseLeave={() => setHoveredCell(null)}
                />
              );
            }),
          )}
        </div>
      </div>
      {createPortal(
        hoveredCell &&
          tooltipCoords && (
            <div
              ref={tooltipRef}
              style={{
                position: "fixed",
                left: tooltipCoords.left,
                top: tooltipCoords.top,
                backgroundColor: "var(--surface-tooltip, var(--bg3))",
                border: "1px solid var(--border-base)",
                borderRadius: "var(--border-radius-sm, 4px)",
                padding: "6px 10px",
                fontSize: "var(--text-xs)",
                color: "var(--fg)",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                zIndex: 9999,
                boxShadow: "var(--shadow)",
              }}
            >
              {hoveredCell.count} tasks {hoveredCell.date}
            </div>
          ),
        document.body,
      )}
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
        fontWeight: "bolder",
        fontSize: "28px",
        opacity: 0.7,
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
      alignItems: "flex-start",
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
        alignItems: "baseline",
        gap: "var(--spacing-xs)",
      }}
    >
      <h1 style={{ width: "auto", fontWeight: 700 }}>{value}</h1>
      <h2>{text}</h2>
    </div>
    <h3 style={{ marginTop: "2px" }}>{subtitle}</h3>
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
      text="Days"
      subtitle="CURRENT STREAK"
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
      text="Tasks"
      subtitle="Today"
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
      text="Days"
      subtitle="TOTAL"
      value={`${24 + (t % 2)}`}
    />
  );
};

const TasksProgressBlock: React.FC = () => {
  const total = 30;
  const completed = 18 + (useTimer(6000) % 2);
  const progress = Math.round((completed / total) * 100);
  let emojiClass = "fa-regular fa-face-smile";
  let emojiColor = "var(--blue)";
  if (progress > 70) {
    emojiClass = "fa-regular fa-face-grin-stars";
    emojiColor = "var(--green)";
  } else if (progress < 21) {
    emojiClass = "fa-regular fa-face-frown";
    emojiColor = "var(--red)";
  } else if (progress < 41) {
    emojiClass = "fa-regular fa-face-meh";
    emojiColor = "var(--yellow)";
  }
  return (
    <Block
      iconClass={emojiClass}
      color={emojiColor}
      text="Tasks"
      subtitle={`${completed}/${total} COMPLETED`}
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
      text="Days"
      subtitle="LONGEST STREAK"
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
      text="Projects"
      subtitle="TOTAL PROJECTS"
      value={`${17 + (t % 2)}`}
    />
  );
};

const DeadlineProjectsBlock: React.FC = () => {
  return (
    <Block
      iconClass="fa-solid fa-fire"
      color="var(--red)"
      text="Projects"
      subtitle="End of month"
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

const WelcomeTab: React.FC = () => {
  const activityCounts = useMemo(buildDemoActivityCounts, []);
  const tasksWithDeadline = useMemo(() => {
    const out: DemoCalendarTask[] = [];
    for (const board of INITIAL_BOARDS) {
      for (const column of board.columns) {
        for (const task of column.tasks) {
          if (task.deadline) {
            out.push({ id: task.id, content: task.content, deadline: task.deadline, completed: task.completed });
          }
        }
      }
    }
    return out;
  }, []);
  return (
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
        <CalendarWidget tasks={tasksWithDeadline} />
        <QuoteWidget />
        <div className="stat_blocks_row">
          <DaysActivityBlock />
          <CurrentStreakBlock />
          <TodayTasksBlock />
        </div>
        <ActivityGraph activityCounts={activityCounts} />
      </div>
    </motion.div>
  );
};

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

const LAUNCHER_COLUMNS: DemoColumn[] = [
  {
    id: "launch-1",
    title: "Backlog",
    color: "var(--bg2)",
    tasks: [
      { id: "l-101", content: "Design updater UI states", completed: false, deadline: "2026-08-06" },
      { id: "l-102", content: "Multi-channel releases (stable / beta)", completed: false, deadline: "2026-08-10" },
      { id: "l-103", content: "Code signing pipeline for macOS builds", completed: false, deadline: "2026-08-14" },
    ],
  },
  {
    id: "launch-2",
    title: "In Progress",
    color: "var(--bg2)",
    tasks: [
      { id: "l-201", content: "Auto-update delta patches", completed: false, deadline: "2026-08-09" },
      { id: "l-202", content: "Playtime tracking hooks", completed: false, deadline: "2026-08-12" },
      { id: "l-203", content: "Game library import & scan", completed: false, deadline: "2026-08-15" },
    ],
  },
  {
    id: "launch-3",
    title: "Completed",
    color: "var(--bg2)",
    tasks: [
      { id: "l-301", content: "Installer bootstrapper", completed: true, deadline: "2026-07-25" },
      { id: "l-302", content: "OAuth login flow", completed: true, deadline: "2026-07-28" },
      { id: "l-303", content: "Download manager resume", completed: true, deadline: "2026-08-01" },
    ],
  },
];

const PIPELINE_COLUMNS: DemoColumn[] = [
  {
    id: "pipe-1",
    title: "Backlog",
    color: "var(--bg2)",
    tasks: [
      { id: "pl-101", content: "Event schema v2 migration", completed: false, deadline: "2026-08-16" },
      { id: "pl-102", content: "Warehouse export (Parquet / S3)", completed: false, deadline: "2026-08-24" },
    ],
  },
  {
    id: "pipe-2",
    title: "In Progress",
    color: "var(--bg2)",
    tasks: [
      { id: "pl-201", content: "Kafka sink for UI events", completed: false, deadline: "2026-08-18" },
      { id: "pl-202", content: "Dashboard latency queries", completed: false, deadline: "2026-08-22" },
    ],
  },
  {
    id: "pipe-3",
    title: "Completed",
    color: "var(--bg2)",
    tasks: [
      { id: "pl-301", content: "Event ingestion API", completed: true, deadline: "2026-07-29" },
      { id: "pl-302", content: "Session rollups", completed: true, deadline: "2026-08-02" },
      { id: "pl-303", content: "Error tracking pipeline", completed: true, deadline: "2026-08-05" },
    ],
  },
];

const INITIAL_BOARDS: DemoBoard[] = [
  { id: "board-1", title: "Product", columns: INITIAL_COLUMNS },
  { id: "board-2", title: "Ops", columns: OPS_COLUMNS },
  { id: "board-launcher", title: "Launcher V2", columns: LAUNCHER_COLUMNS },
  { id: "board-pipeline", title: "Analytics Pipeline", columns: PIPELINE_COLUMNS },
];

const TaskContent: React.FC<{
  task: DemoTask;
  columnId: string;
  bg_color: string;
  onToggleTask: (columnId: string, taskId: string) => void;
  onOpen: (columnId: string, task: DemoTask) => void;
}> = ({ task, columnId, bg_color, onToggleTask, onOpen }) => (
  <div
    className="task-content"
    role="button"
    tabIndex={0}
    onContextMenu={(e) => {
      e.preventDefault();
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggleTask(columnId, task.id);
      }
    }}
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
        padding: "0 var(--spacing-l)",
        boxSizing: "border-box",
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
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0",
            margin: "0px",
          }}
        >
          <input
            className="checkbox"
            style={{ margin: "0px", padding: "0px" }}
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleTask(columnId, task.id)}
          />
          <p
            className="task-text centered_content"
            style={{
              opacity: "0.9",
              width: "auto",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "var(--spacing-s)",
              color: getTextColorForBg(bg_color),
              padding: "0px",
              margin: "0px",
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
            width: "100%",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            cursor: "text",
            height: "auto",
            padding: "0px",
            margin: "0px",
            paddingBottom: "var(--spacing-m)",
            transition: "color 0.3s ease-in",
            color: getTextColorForBg(bg_color),
            textAlign: "left",
          }}
          onClick={() => onOpen(columnId, task)}
        >
          {task.content}
        </button>
      </div>
      {(() => {
        const lastAction = demoLastAction(task);
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              height: "50px",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0",
              margin: "0px",
            }}
          >
            <span
              style={{
                padding: "0px",
                margin: "0px",
                opacity: "0.65",
                color: getTextColorForBg(bg_color),
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
            >
              {TASK_ACTION_LABELS[lastAction.action] ?? lastAction.action}
            </span>
            <span
              style={{
                padding: "0px",
                margin: "0px",
                opacity: "0.65",
                color: getTextColorForBg(bg_color),
                flexShrink: 0,
              }}
            >
              {lastAction.userName}
            </span>
          </div>
        );
      })()}
    </div>
  </div>
);

const Task: React.FC<{
  task: DemoTask;
  columnId: string;
  color: string;
  onToggleTask: (columnId: string, taskId: string) => void;
  onOpen: (columnId: string, task: DemoTask) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
}> = ({ task, columnId, color, onToggleTask, onOpen, onDragStart, onDragEnd }) => (
  <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 1, scale: 1 }}>
    <div
      draggable
      className="task-container"
      style={{ backgroundColor: color || "var(--bg2)", cursor: "grab" }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <TaskContent task={task} columnId={columnId} bg_color={color} onToggleTask={onToggleTask} onOpen={onOpen} />
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
  onOpen: (columnId: string, task: DemoTask) => void;
  onTaskDrop: (e: React.DragEvent, column: DemoColumn) => void;
}> = ({ column, onToggleTask, onOpen, onTaskDrop }) => (
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
          onOpen={onOpen}
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
  onOpen: (columnId: string, task: DemoTask) => void;
  onCreateTask: (columnId: string) => void;
  onColumnDrop: (e: React.DragEvent<HTMLDivElement>, column: DemoColumn) => void;
  onTaskDrop: (e: React.DragEvent, column: DemoColumn) => void;
}> = ({ column, onToggleTask, onOpen, onCreateTask, onColumnDrop, onTaskDrop }) => (
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
      <TaskList column={column} onToggleTask={onToggleTask} onOpen={onOpen} onTaskDrop={onTaskDrop} />
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

const DemoTasksHeader: React.FC<{ columns: DemoColumn[] }> = ({ columns }) => {
  const { totalTasks, completedTasks } = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    for (const column of columns) {
      for (const task of column.tasks) {
        totalTasks++;
        if (task.completed) completedTasks++;
      }
    }
    return { totalTasks, completedTasks };
  }, [columns]);
  const completionPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  return (
    <div className="tab_header_content">
      <div
        className="progress"
        style={{ margin: "0px", padding: "0px", width: "220px", height: "15px", backgroundColor: "var(--bg2)" }}
      >
        <div
          className="progress-bar"
          style={{
            margin: "0px",
            padding: "0px",
            width: `${completionPercentage}%`,
            height: "15px",
            backgroundColor: "var(--accent)",
          }}
        />
      </div>
      <strong>
        {completedTasks}/{totalTasks}
      </strong>
    </div>
  );
};

/* Fake action-history data (the app keeps real per-task logs; the demo
   synthesizes deterministic entries so the EditTaskModal history panel and
   the per-card last-action row behave identically). */
const TASK_ACTION_LABELS: Record<string, string> = {
  edit: "Edit",
  assign: "Assign",
  complete: "Complete",
  reopen: "Reopen",
  change_column: "Change column",
  change_color: "Change color",
  change_order: "Change order",
  change_deadline: "Change deadline",
};

const DEMO_USERS: ReadonlyArray<readonly [string, string]> = [
  ["Alex Mercer", "alex@owl.dev"],
  ["Sam Rivera", "sam@owl.dev"],
  ["Mia Chen", "mia@owl.dev"],
  ["Leo Park", "leo@owl.dev"],
];

type DemoTaskLastAction = [action: string, userName: string, userEmail: string, createdAt: string];

function hashDemoId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

const demoLastAction = (task: DemoTask): { action: string; userName: string } => {
  const h = hashDemoId(task.id);
  const actions = task.completed
    ? ["complete", "change_column", "change_color"]
    : ["edit", "edit", "change_deadline", "assign", "reopen", "change_order"];
  return {
    action: actions[h % actions.length],
    userName: DEMO_USERS[(h + 1) % DEMO_USERS.length][0],
  };
};

const demoLastActions = (task: DemoTask): DemoTaskLastAction[] => {
  const h = hashDemoId(task.id);
  const actions = ["edit", "change_column", "change_deadline", "complete", "reopen", "assign", "change_color", "change_order"];
  const now = Date.now();
  const out: DemoTaskLastAction[] = [];
  for (let i = 0; i < 4; i++) {
    const [name, email] = DEMO_USERS[(h + i) % DEMO_USERS.length];
    out.push([
      actions[(h + i) % actions.length],
      name,
      email,
      new Date(now - (i + 0.4) * 13 * 3600e3).toISOString(),
    ]);
  }
  return out;
};

/* EditTaskModal from Tasks/EditTaskModal.tsx of the app: task text + deadline
   editors with a scrollable history of the last actions; hovering (or
   clicking) a history item shows a tooltip with the user email to copy. */
const EditTaskModal: React.FC<{
  tempContent: string;
  onContentChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  deadline: string;
  onDeadlineChange: (value: string) => void;
  task: DemoTask;
}> = ({ tempContent, onContentChange, onSave, onCancel, deadline, onDeadlineChange, task }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    action: string;
    userName: string;
    userEmail: string;
    date: string;
  } | null>(null);
  const lastActions = demoLastActions(task);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) onSave();
  };

  const btnStyle: React.CSSProperties = {
    flex: 1,
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--spacing-xs)",
    background: "var(--bg2)",
    border: "none",
    color: "var(--fg)",
    cursor: "pointer",
    borderRadius: "var(--border-radius)",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <motion.div
      className="modal-overlay"
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="modal-content"
        ref={contentRef}
        style={{ width: "800px", maxHeight: "400px", overflow: "hidden" }}
        initial={{ opacity: 0, y: -200 }}
        exit={{ opacity: 0, y: -200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          style={{
            display: "flex",
            gap: "var(--spacing-m)",
            width: "100%",
            alignItems: "stretch",
            minHeight: 0,
            maxHeight: "360px",
          }}
        >
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <textarea
              className="task-text"
              value={tempContent}
              onChange={(e) => onContentChange(e.target.value)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                width: "100%",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                height: "100%",
                minHeight: "230px",
                padding: "0px",
                margin: "0px",
                resize: "none",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "var(--spacing-m)",
              }}
            >
              <span style={{ whiteSpace: "nowrap" }}>Deadline:</span>
              <input
                className="project_deadline"
                style={{ width: "auto", minWidth: "120px" }}
                type="date"
                value={deadline ? deadline.split("T")[0] : ""}
                onChange={(e) => onDeadlineChange(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: "var(--spacing-s)", width: "100%", marginTop: "var(--spacing-m)" }}>
              <button style={btnStyle} onClick={onSave}>
                <i className="fa-solid fa-hard-drive"></i> Save
              </button>
              <button style={btnStyle} onClick={onCancel}>
                <i className="fa-solid fa-xmark"></i> Cancel
              </button>
            </div>
          </div>
          {lastActions.length > 0 && (
            <div
              style={{
                flex: 1,
                minWidth: 0,
                minHeight: 0,
                paddingLeft: "var(--spacing-m)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div className="task-history" style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                {lastActions.map(([action, userName, userEmail, createdAt], i) => (
                  <div
                    className="task-history-item"
                    key={i}
                    onClick={() => userEmail && navigator.clipboard?.writeText(userEmail)}
                    onMouseEnter={(e) =>
                      userEmail &&
                      setTooltip({
                        x: e.clientX,
                        y: e.clientY,
                        action,
                        userName,
                        userEmail,
                        date: new Date(createdAt).toLocaleString(),
                      })
                    }
                    onMouseMove={(e) => setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : prev))}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <div className="task-history-item-header">
                      <span className="task-history-action">{TASK_ACTION_LABELS[action] ?? action}</span>
                      <span className="task-history-user">{userName}</span>
                    </div>
                    <div className="task-history-item-date">{new Date(createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {tooltip && (
          <div className="action-email-tooltip" style={{ position: "fixed", top: tooltip.y + 16, left: tooltip.x + 16 }}>
            <div>{TASK_ACTION_LABELS[tooltip.action] ?? tooltip.action}</div>
            <div>{tooltip.userName}</div>
            <div>{tooltip.userEmail}</div>
            <div>{tooltip.date}</div>
            <div>Click to copy</div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const TasksTab: React.FC = () => {
  const [boards, setBoards] = useState<DemoBoard[]>(INITIAL_BOARDS);
  const [currentBoardId, setCurrentBoardId] = useState<string>(INITIAL_BOARDS[0].id);
  const [isBoardsListVisible, setIsBoardsListVisible] = useState(true);
  const [editing, setEditing] = useState<{ boardId: string; columnId: string; taskId: string } | null>(null);
  const [tempContent, setTempContent] = useState("");
  const [tempDeadline, setTempDeadline] = useState("");

  const currentBoard = boards.find((b) => b.id === currentBoardId) || boards[0];
  const columns = currentBoard?.columns ?? [];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && (event.code === "KeyB" || event.key === "b")) {
        event.preventDefault();
        setIsBoardsListVisible((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const openTaskEditor = (columnId: string, task: DemoTask) => {
    setTempContent(task.content);
    setTempDeadline(task.deadline ?? "");
    setEditing({ boardId: currentBoardId, columnId, taskId: task.id });
  };

  const handleEditTaskSave = () => {
    if (!editing) return;
    updateBoard(editing.boardId, (b) => ({
      ...b,
      columns: b.columns.map((col) =>
        col.id === editing.columnId
          ? {
              ...col,
              tasks: col.tasks.map((t) =>
                t.id === editing.taskId ? { ...t, content: tempContent, deadline: tempDeadline || undefined } : t,
              ),
            }
          : col,
      ),
    }));
    setEditing(null);
  };

  const editingTask = editing
    ? boards
        .find((b) => b.id === editing.boardId)
        ?.columns.find((c) => c.id === editing.columnId)
        ?.tasks.find((t) => t.id === editing.taskId)
    : undefined;

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
        <AnimatePresence>
          {isBoardsListVisible && (
            <motion.div
              key="boards-panel"
              initial={{ width: 0 }}
              animate={{ width: 320 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden", height: "100%", flexShrink: 0, marginLeft: "var(--spacing-l)" }}
            >
              <motion.div
                className="boards-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: 0.15 }}
                style={{ padding: "10px", height: "100%", overflowY: "auto", marginLeft: "auto" }}
              >
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
              onOpen={openTaskEditor}
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
              className="tr_button task-block-header centered_content"
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
      <DemoTasksHeader columns={columns} />
      <AnimatePresence>
        {editing && editingTask && (
          <EditTaskModal
            task={editingTask}
            tempContent={tempContent}
            onContentChange={setTempContent}
            onSave={handleEditTaskSave}
            onCancel={() => setEditing(null)}
            deadline={tempDeadline}
            onDeadlineChange={setTempDeadline}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ------------------------------ Projects tab --------------------------------- */

export interface DemoProjectMember {
  user_id: number;
  name: string;
  email: string;
  role: "OWNER" | "MEMBER";
}

export interface DemoProject {
  id: string;
  title: string;
  created_at: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  status: string;
  about?: string;
  link_to?: string;
  board_id?: string;
  is_owner?: boolean;
  user_id?: number;
  members?: DemoProjectMember[];
}

/* Public users fetched by the app's ProjectMembersModal (api.getPublicUsers);
   the demo lists the ones that aren't members of the current project yet. */
const DEMO_PUBLIC_USERS: Array<{ id: number; name: string; email: string }> = [
  { id: 101, name: "Elena Volkov", email: "elena@owl.dev" },
  { id: 102, name: "Noah Fischer", email: "noah@owl.dev" },
  { id: 103, name: "Yuki Tanaka", email: "yuki@owl.dev" },
  { id: 104, name: "Ivan Petrov", email: "ivan@owl.dev" },
  { id: 105, name: "Sofia Rossi", email: "sofia@owl.dev" },
  { id: 106, name: "Mateo Garcia", email: "mateo@owl.dev" },
  { id: 107, name: "Hannah Mueller", email: "hannah@owl.dev" },
  { id: 108, name: "Felix Weber", email: "felix@owl.dev" },
  { id: 109, name: "Aya Nakamura", email: "aya@owl.dev" },
  { id: 110, name: "Omar Haddad", email: "omar@owl.dev" },
  { id: 111, name: "Petra Novak", email: "petra@owl.dev" },
  { id: 112, name: "Liam O'Connor", email: "liam@owl.dev" },
  { id: 113, name: "Eva Kowalski", email: "eva@owl.dev" },
  { id: 114, name: "Arjun Patel", email: "arjun@owl.dev" },
  { id: 115, name: "Maria Santos", email: "maria@owl.dev" },
  { id: 116, name: "Daniel Kim", email: "daniel@owl.dev" },
];

const INITIAL_PROJECTS: DemoProject[] = [
  {
    id: "p1",
    title: "Launcher v2.0",
    created_at: "2026-03-04",
    deadline: "2026-08-15",
    priority: "high",
    status: "In Progress",
    board_id: "board-launcher",
    link_to: "https://github.com/owl/launcher",
    about: `## Mission

**Launcher V2** is the next-gen desktop client: *faster*, lighter and fully keyboard-driven.

### Current sprint

- [x] Installer bootstrapper
- [x] OAuth login flow
- [ ] Auto-update delta patches
- [ ] Game library import & scan

### Stack

\`\`\`ts
export const launcher = {
  runtime: "Tauri 2",
  ui: "React 19",
  updates: "delta + code signing",
};
\`\`\`

> Drops the legacy updater in favor of a signed multi-channel pipeline.`,
    is_owner: true,
    user_id: 1,
    members: [
      { user_id: 1, name: "Night Owl", email: "night@owl.app", role: "OWNER" },
      { user_id: 2, name: "Lena", email: "lena@owl.app", role: "MEMBER" },
      { user_id: 3, name: "Mira", email: "mira@owl.app", role: "MEMBER" },
      { user_id: 4, name: "Kira", email: "kira@owl.app", role: "MEMBER" },
      { user_id: 5, name: "Alex", email: "alex@owl.app", role: "MEMBER" },
      { user_id: 6, name: "Ivan", email: "ivan@owl.app", role: "MEMBER" },
      { user_id: 7, name: "Dima", email: "dima@owl.app", role: "MEMBER" },
      { user_id: 8, name: "Anna", email: "anna@owl.app", role: "MEMBER" },
      { user_id: 9, name: "Max", email: "max@owl.app", role: "MEMBER" },
      { user_id: 10, name: "Zoe", email: "zoe@owl.app", role: "MEMBER" },
      { user_id: 11, name: "Leo", email: "leo@owl.app", role: "MEMBER" },
      { user_id: 12, name: "Nina", email: "nina@owl.app", role: "MEMBER" },
      { user_id: 13, name: "Oscar", email: "oscar@owl.app", role: "MEMBER" },
      { user_id: 14, name: "Pia", email: "pia@owl.app", role: "MEMBER" },
      { user_id: 15, name: "Quinn", email: "quinn@owl.app", role: "MEMBER" },
      { user_id: 16, name: "Rita", email: "rita@owl.app", role: "MEMBER" },
      { user_id: 17, name: "Sam", email: "sam@owl.app", role: "MEMBER" },
      { user_id: 18, name: "Tina", email: "tina@owl.app", role: "MEMBER" },
      { user_id: 19, name: "Uma", email: "uma@owl.app", role: "MEMBER" },
      { user_id: 20, name: "Vik", email: "vik@owl.app", role: "MEMBER" },
      { user_id: 21, name: "Wendy", email: "wendy@owl.app", role: "MEMBER" },
      { user_id: 22, name: "Xavi", email: "xavi@owl.app", role: "MEMBER" },
      { user_id: 23, name: "Yara", email: "yara@owl.app", role: "MEMBER" },
      { user_id: 24, name: "Zack", email: "zack@owl.app", role: "MEMBER" },
      { user_id: 25, name: "Alice", email: "alice@owl.app", role: "MEMBER" },
      { user_id: 26, name: "Bob", email: "bob@owl.app", role: "MEMBER" },
      { user_id: 27, name: "Cara", email: "cara@owl.app", role: "MEMBER" },
      { user_id: 28, name: "Dan", email: "dan@owl.app", role: "MEMBER" },
      { user_id: 29, name: "Eli", email: "eli@owl.app", role: "MEMBER" },
      { user_id: 30, name: "Faye", email: "faye@owl.app", role: "MEMBER" },
      { user_id: 31, name: "Gus", email: "gus@owl.app", role: "MEMBER" },
      { user_id: 32, name: "Hana", email: "hana@owl.app", role: "MEMBER" },
      { user_id: 33, name: "Ida", email: "ida@owl.app", role: "MEMBER" },
      { user_id: 34, name: "Jake", email: "jake@owl.app", role: "MEMBER" },
      { user_id: 35, name: "Kai", email: "kai@owl.app", role: "MEMBER" },
      { user_id: 36, name: "Luna", email: "luna@owl.app", role: "MEMBER" },
      { user_id: 37, name: "Mia", email: "mia@owl.app", role: "MEMBER" },
      { user_id: 38, name: "Nick", email: "nick@owl.app", role: "MEMBER" },
      { user_id: 39, name: "Olya", email: "olya@owl.app", role: "MEMBER" },
      { user_id: 40, name: "Pavel", email: "pavel@owl.app", role: "MEMBER" },
      { user_id: 41, name: "Rada", email: "rada@owl.app", role: "MEMBER" },
      { user_id: 42, name: "Sasha", email: "sasha@owl.app", role: "MEMBER" },
      { user_id: 43, name: "Toma", email: "toma@owl.app", role: "MEMBER" },
      { user_id: 44, name: "Ulya", email: "ulya@owl.app", role: "MEMBER" },
      { user_id: 45, name: "Vera", email: "vera@owl.app", role: "MEMBER" },
      { user_id: 46, name: "Wade", email: "wade@owl.app", role: "MEMBER" },
      { user_id: 47, name: "Sonia", email: "sonia@owl.app", role: "MEMBER" },
      { user_id: 48, name: "Roma", email: "roma@owl.app", role: "MEMBER" },
      { user_id: 49, name: "Gleb", email: "gleb@owl.app", role: "MEMBER" },
      { user_id: 50, name: "Mila", email: "mila@owl.app", role: "MEMBER" },
      { user_id: 51, name: "Den", email: "den@owl.app", role: "MEMBER" },
      { user_id: 52, name: "Rus", email: "rus@owl.app", role: "MEMBER" },
      { user_id: 53, name: "Vita", email: "vita@owl.app", role: "MEMBER" },
      { user_id: 54, name: "Kristina", email: "kristina@owl.app", role: "MEMBER" },
      { user_id: 55, name: "Anton", email: "anton@owl.app", role: "MEMBER" },
      { user_id: 56, name: "Dasha", email: "dasha@owl.app", role: "MEMBER" },
    ],
  },
  {
    id: "p2",
    title: "Analytics pipeline",
    created_at: "2026-05-22",
    deadline: "2026-09-01",
    priority: "low",
    status: "On Hold",
    board_id: "board-pipeline",
    about: `## Goal

Event collection from **all clients** into a single warehouse.

- [x] Event ingestion API
- [x] Session rollups
- [ ] Kafka sink for UI events
- [ ] Event schema v2 migration

### Pipeline

\`events → kafka → rollups → parquet\` with **99.9%** delivery SLA.

> Latency budget: under 60s from click to dashboard.`,
    is_owner: true,
    user_id: 1,
    members: [
      { user_id: 1, name: "Night Owl", email: "night@owl.app", role: "OWNER" },
    ],
  },
  {
    id: "p3",
    title: "Mobile companion",
    created_at: "2026-06-11",
    deadline: "2026-11-20",
    priority: "medium",
    status: "Planned",
    is_owner: true,
    user_id: 1,
    members: [],
  },
  {
    id: "p4",
    title: "Team workspace",
    created_at: "2026-04-17",
    deadline: "2026-06-30",
    priority: "medium",
    status: "Completed",
    is_owner: true,
    user_id: 1,
    members: [
      { user_id: 1, name: "Night Owl", email: "night@owl.app", role: "OWNER" },
      { user_id: 2, name: "Lena", email: "lena@owl.app", role: "MEMBER" },
    ],
  },
];

const ProjectCard: React.FC<{
  project: DemoProject;
  index: number;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onOpen: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}> = ({ project, index, onDragStart, onDragEnd, onOpen, onContextMenu }) => {
  const statusColor = getStatusColor(project.status);
  const priorityColor = getPriorityColor(project.priority);
  const { days } = getDeadlineDifference(project.deadline);

  const isOverdue = days !== null && days < 0;
  const isSoon = days !== null && days >= 0 && days <= 7;
  const daysColor = isOverdue ? "var(--red)" : isSoon ? "var(--yellow)" : "var(--fg-secondary)";

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
        onContextMenu={onContextMenu}
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
        <div className="project_card_inner">
          <div className="project_card_header">
            <input
              className="project_title_input"
              placeholder="Project title"
              value={project.title}
              readOnly
            />
            {project.link_to && (
              <a
                href={project.link_to}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
                title="Project link"
                className="project_card_link"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            )}
          </div>

          <div className="project_card_grid">
            <div className="project_card_meta_row">
              <i className="fa-regular fa-calendar-plus" style={{ color: "var(--fg-secondary)" }}></i>
              <strong className="project_card_meta_text">
                {formatDate(project.created_at)} –{" "}
                <span style={{ color: isOverdue ? "var(--red)" : isSoon ? "var(--yellow)" : undefined, fontWeight: 700 }}>
                  {formatDate(project.deadline)}
                </span>
              </strong>
            </div>
            <div className="project_card_meta_row">
              <span
                className="project_card_priority_marker"
                style={{ color: priorityColor, textTransform: "capitalize" }}
                title={`Priority: ${project.priority}`}
              >
                {project.priority === "high" ? (
                  <i className="fa-solid fa-chevron-up"></i>
                ) : project.priority === "medium" ? (
                  <i className="fa-solid fa-chevron-right"></i>
                ) : (
                  <i className="fa-solid fa-chevron-down"></i>
                )}
                {project.priority}
              </span>
            </div>
            {days !== null && (
              <div className="project_card_meta_row">
                <i className="fa-regular fa-clock" style={{ color: daysColor }}></i>
                <strong className="project_card_meta_text" style={{ color: daysColor }}>
                  {isOverdue ? `${Math.abs(days)} days overdue` : `${days} days left`}
                </strong>
              </div>
            )}
            <div className="project_card_meta_row">
              <strong className="project_card_meta_text" style={{ color: statusColor, textTransform: "capitalize" }}>
                {project.status}
              </strong>
            </div>
          </div>

          <div className="project_card_footer">
            <div className="project_card_members">
              {project.members && project.members.length > 0 ? (
                <>
                  {project.members.slice(0, 5).map((member, i) => (
                    <div
                      key={member.user_id}
                      title={member.name || member.email}
                      className="project_card_avatar"
                      style={{
                        backgroundColor: getAvatarColor(member.user_id),
                        marginLeft: i === 0 ? 0 : "-8px",
                        zIndex: (project.members?.length ?? 0) - i,
                      }}
                    >
                      {getMemberInitial(member)}
                    </div>
                  ))}
                  {(project.members?.length ?? 0) > 5 && (
                    <div
                      className="project_card_avatar"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        margin: "0px",
                        padding: "0px",
                        zIndex: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "var(--text-xxl)",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      +{project.members.length - 5}
                    </div>
                  )}
                </>
              ) : (
                <span style={{ fontSize: "var(--text-sm)", color: "var(--fg-secondary)" }}>No members</span>
              )}
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
  switch (priority) {
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

/* Avatar helpers from Projects/ProjectCard.tsx of the app */
const AVATAR_COLORS = [
  "var(--red)",
  "var(--yellow)",
  "var(--green)",
  "var(--blue)",
  "var(--purple)",
  "var(--pink)",
  "var(--cyan)",
];

const getAvatarColor = (userId: number): string => AVATAR_COLORS[userId % AVATAR_COLORS.length];

const getMemberInitial = (member: DemoProjectMember): string => {
  const letter = member.email ? member.email.charAt(0) : member.name ? member.name.charAt(0) : "?";
  return letter.toUpperCase();
};

/* getDeadlineDifference() from Projects/ProjectsComponents.tsx of the app */
const getDeadlineDifference = (deadline: string): { days: number | null } => {
  if (!deadline) return { days: null };
  const deadlineDate = new Date(deadline);
  if (isNaN(deadlineDate.getTime())) return { days: null };
  const currentDate = new Date();
  const differenceInTime = deadlineDate.getTime() - currentDate.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  return { days: differenceInDays };
};

/* formatDate() from Projects/ProjectCard.tsx of the app */
const formatDate = (date: string): string => {
  if (!date) return "-";
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-EN", { day: "2-digit", month: "short", year: "numeric" });
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
      disabled={!sortBy}
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
    <div className="project_modal_progress">
      <CircularProgressBar
        style={{ width: "60px", height: "60px", maxWidth: "60px", padding: "0px", margin: "0px", maxHeight: "60px" }}
        size={60}
        strokeWidth={10}
        progress={progress}
        progressColor={"var(--green)"}
      />
    </div>
  );
};

const FieldLabel: React.FC<{ icon: string; children: React.ReactNode }> = ({ icon, children }) => (
  <label className="project_modal_field_label">
    <i className={icon}></i>
    {children}
  </label>
);

const MEMBER_PAGE_SIZE = 50;
const PUBLIC_PAGE_SIZE = 50;

const matchesQuery = (query: string, ...fields: (string | null | undefined)[]): boolean => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((f) => (f ?? "").toLowerCase().includes(q));
};

const SearchIcon: React.FC<{ color?: string }> = ({ color = "var(--fg-secondary)" }) => (
  <i
    className="fa-solid fa-magnifying-glass"
    style={{
      position: "absolute",
      left: "var(--spacing-m)",
      top: "50%",
      transform: "translateY(-50%)",
      color,
      pointerEvents: "none",
      fontSize: "var(--text-base)",
    }}
  ></i>
);

const ProjectMembersModal: React.FC<{
  projectId: string;
  projectTitle: string;
  ownerId: number;
  members: DemoProjectMember[];
  onAddMember: (email: string) => void;
  onRemoveMember: (userId: number) => void;
  onClose: () => void;
}> = ({ projectId, projectTitle, ownerId, members, onAddMember, onRemoveMember, onClose }) => {
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [publicSearch, setPublicSearch] = useState("");
  const [memberLimit, setMemberLimit] = useState(MEMBER_PAGE_SIZE);
  const [publicLimit, setPublicLimit] = useState(PUBLIC_PAGE_SIZE);
  const contentRef = useRef<HTMLDivElement>(null);

  const isOwner = (member: DemoProjectMember): boolean => member.role === "OWNER";
  const isCurrentUserOwner = (): boolean => ownerId === 1;
  const canRemoveMember = (member: DemoProjectMember): boolean => isCurrentUserOwner() && !isOwner(member);

  const availablePublicUsers = useMemo(
    () => DEMO_PUBLIC_USERS.filter((u) => !members.some((m) => m.email.toLowerCase() === u.email.toLowerCase())),
    [members],
  );

  const filteredMembers = useMemo(
    () => members.filter((member) => matchesQuery(memberSearch, member.name, member.email)),
    [members, memberSearch],
  );

  const filteredPublicUsers = useMemo(
    () => availablePublicUsers.filter((user) => matchesQuery(publicSearch, user.name, user.email)),
    [availablePublicUsers, publicSearch],
  );

  useEffect(() => {
    setMemberLimit(MEMBER_PAGE_SIZE);
  }, [memberSearch, members]);

  useEffect(() => {
    setPublicLimit(PUBLIC_PAGE_SIZE);
  }, [publicSearch, availablePublicUsers]);

  const handleAddMember = () => {
    const email = newEmail.trim();
    if (!email) return;
    if (members.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
      setError("This email is already a member");
      return;
    }
    setError("");
    onAddMember(email);
    setNewEmail("");
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        style={{ width: "calc(80% - var(--spacing-xxl) - var(--spacing-xxl))", justifyContent: "flex-start" }}
        initial={{ opacity: 0, y: -200 }}
        exit={{ opacity: 0, y: -200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button className="modal_close_button" onClick={onClose} aria-label="Close" title="Close">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div style={{ display: "flex", flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "flex-start" }}>
          <p className="project_title" style={{ textAlign: "left", width: "auto" }}>
            {projectTitle}
          </p>
        </div>

        {error && (
          <div
            style={{
              color: "var(--bg)",
              padding: "var(--spacing-m)",
              backgroundColor: "var(--red)",
              borderRadius: "var(--border-radius)",
              marginBottom: "var(--spacing-m)",
            }}
          >
            {error}
          </div>
        )}

        <div className="project-members-modal-body">
          <div className="project-members-column">
            <p style={{ fontWeight: 500, fontSize: "var(--text-lg)" }}>
              Members{" "}
              <span style={{ color: "var(--fg-secondary)", fontWeight: 400 }}>({members.length})</span>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-s)", width: "100%", minHeight: 0 }}>
              <div style={{ position: "relative", width: "100%" }}>
                <SearchIcon />
                <input
                  placeholder="Search members"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  style={{
                    width: "calc(100% - calc(var(--spacing-l) + var(--spacing-s)))",
                    paddingLeft: "calc(var(--spacing-l) + var(--spacing-s))",
                  }}
                />
              </div>
              {filteredMembers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "var(--spacing-l)", color: "var(--fg-secondary)" }}>
                  {members.length === 0 ? "No members" : "No members found"}
                </div>
              ) : (
                <div className="project-members-list">
                  {filteredMembers.slice(0, memberLimit).map((member) => (
                    <div
                      key={member.user_id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "transparent",
                        flexShrink: 0,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-m)", minWidth: 0 }}>
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            backgroundColor: isOwner(member) ? "var(--red)" : "var(--green)",
                            color: "var(--bg)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "var(--text-4xl)",
                            aspectRatio: 1 / 1,
                            flexShrink: 0,
                          }}
                        >
                          {member.name ? member.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "auto",
                            gap: "5px",
                            minWidth: 0,
                          }}
                        >
                          <div style={{ fontWeight: 500, fontSize: "var(--text-lg)" }}>{member.name || "Unknown"}</div>
                          <div style={{ fontSize: "var(--text-base)", color: "var(--fg-secondary)" }}>{member.email}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-m)", flexShrink: 0 }}>
                        {canRemoveMember(member) && (
                          <button
                            className="button"
                            onClick={() => onRemoveMember(member.user_id)}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignContent: "center",
                              alignItems: "center",
                              textAlign: "center",
                              justifyContent: "center",
                              background: "var(--red)",
                              color: "var(--bg)",
                            }}
                            title="Remove member"
                          >
                            <i className="fa-solid fa-trash" style={{ margin: "0px", padding: "0px" }}></i>
                          </button>
                        )}
                        <span
                          className="button"
                          style={{
                            width: "80px",
                            fontWeight: "bolder",
                            display: "flex",
                            flexDirection: "column",
                            alignContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            justifyContent: "center",
                            backgroundColor: isOwner(member) ? "var(--red)" : "var(--green)",
                            color: "var(--bg)",
                          }}
                        >
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {filteredMembers.length > memberLimit && (
                <button className="button" onClick={() => setMemberLimit((limit) => limit + MEMBER_PAGE_SIZE)} style={{ width: "100%" }}>
                  Show more ({filteredMembers.length - memberLimit})
                </button>
              )}
            </div>
          </div>

          <div className="project-users-column">
            <p style={{ fontWeight: 500, fontSize: "var(--text-lg)" }}>
              Public users{" "}
              <span style={{ color: "var(--fg-secondary)", fontWeight: 400 }}>({availablePublicUsers.length})</span>
            </p>

            {availablePublicUsers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "var(--spacing-l)", color: "var(--fg-secondary)" }}>
                No public users
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-s)", width: "100%", minHeight: 0 }}>
                <div style={{ position: "relative", width: "100%" }}>
                  <SearchIcon />
                  <input
                    placeholder="Search public users"
                    value={publicSearch}
                    onChange={(e) => setPublicSearch(e.target.value)}
style={{
                      width: "calc(100% - calc(var(--spacing-l) + var(--spacing-s)))",
                      paddingLeft: "calc(var(--spacing-l) + var(--spacing-s))",
                    }}
                  />
                </div>
                {filteredPublicUsers.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "var(--spacing-l)", color: "var(--fg-secondary)" }}>
                    No users found
                  </div>
                ) : (
                  <div className="project-users-list">
                    {filteredPublicUsers.slice(0, publicLimit).map((user) => (
                      <div
                        key={user.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "transparent",
                          flexShrink: 0,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-m)", minWidth: 0 }}>
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              backgroundColor: "var(--blue)",
                              color: "var(--bg)",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "var(--text-4xl)",
                              aspectRatio: 1 / 1,
                              flexShrink: 0,
                            }}
                          >
                            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", width: "auto", gap: "5px", minWidth: 0 }}>
                            <div style={{ fontWeight: 500, fontSize: "var(--text-lg)" }}>{user.name || "Unknown"}</div>
                            <div style={{ fontSize: "var(--text-base)", color: "var(--fg-secondary)" }}>{user.email}</div>
                          </div>
                        </div>
                        <button
                          className="button"
                          onClick={() => onAddMember(user.email)}
                          disabled={!isCurrentUserOwner()}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            justifyContent: "center",
                            background: "var(--blue)",
                            color: "var(--bg)",
                            flexShrink: 0,
                          }}
                          title="Add member"
                        >
                          <i className="fa-solid fa-plus" style={{ margin: "0px", padding: "0px" }}></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {filteredPublicUsers.length > publicLimit && (
                  <button className="button" onClick={() => setPublicLimit((limit) => limit + PUBLIC_PAGE_SIZE)} style={{ width: "100%" }}>
                    Show more ({filteredPublicUsers.length - publicLimit})
                  </button>
                )}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "row", gap: "var(--spacing-m)", width: "100%" }}>
              <DemoInputField
                label="Member email"
                value={newEmail}
                name="email"
                type="email"
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button
                className="button"
                id="green"
                onClick={handleAddMember}
                disabled={!isCurrentUserOwner() || !newEmail.trim()}
                style={{ width: "130px" }}
              >
                <i className="fa-solid fa-plus"></i> Add
              </button>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="button" id="green" onClick={onClose} style={{ width: "60%" }}>
            <i className="fa-solid fa-sd-card"></i> Save
          </button>
        </div>
      </motion.div>
    </motion.div>
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
    priority: project.priority || "low",
    board_id: project.board_id || "",
    created_at: project.created_at || new Date().toISOString(),
    is_owner: project.is_owner ?? true,
    user_id: project.user_id ?? 1,
    members: project.members || [],
  });
  const [members, setMembers] = useState<DemoProjectMember[]>(project.members || []);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const statusColor = getStatusColor(formData.status);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave({ ...formData, members });
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        /* a select popup is open — let it close itself, don't close the modal */
        if (document.querySelector(".owl-demo .demo-select-popup")) return;
        if (!membersModalOpen) onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, membersModalOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (membersModalOpen) return;
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
        <button className="modal_close_button" onClick={onClose} aria-label="Close" title="Close">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="project_modal_body">
          <div className="project_modal_main">
            <div className="project_modal_header">
              <DemoInputField
                label="Project title"
                value={formData.title}
                name="title"
                onChange={handleChange}
                className="project_title"
              />
              <ProjectTasksProgress boardId={formData.board_id ?? ""} />
            </div>

            <div className="project_modal_field project_modal_about">
              <MarkdownEditor
                value={formData.about ?? ""}
                onChange={(markdown) => setFormData((prev) => ({ ...prev, about: markdown }))}
                editable={formData.is_owner}
                placeholder="About project"
              />
            </div>
          </div>

          <div className="project_modal_params">
            <div className="project_modal_field">
              <FieldLabel icon="fa-solid fa-chart-simple">Status</FieldLabel>
              <DemoSelect
                value={formData.status}
                onChange={(v) => setFormData((prev) => ({ ...prev, status: v }))}
                ariaLabel="Project status"
                placeholder="Select status"
                triggerStyle={{
                  backgroundColor: statusColor,
                  color: "var(--bg)",
                  width: "100%",
                  height: "40px",
                  textAlign: "left",
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

            <div className="project_modal_field">
              <FieldLabel icon="fa-solid fa-brain">Priority</FieldLabel>
              <DemoSelect
                value={formData.priority}
                onChange={(v) => setFormData((prev) => ({ ...prev, priority: v as DemoProject["priority"] }))}
                ariaLabel="Project priority"
                placeholder="Select priority"
                triggerStyle={{
                  backgroundColor: getPriorityColor(formData.priority),
                  color: "var(--bg)",
                  width: "100%",
                  height: "40px",
                  textAlign: "left",
                }}
                options={(["low", "medium", "high"] as const).map((priority) => ({
                  value: priority,
                  label: priority,
                  color: getPriorityColor(priority),
                }))}
              />
            </div>

            <div className="project_modal_field">
              <FieldLabel icon="fa-regular fa-clock">Deadline</FieldLabel>
              <div className="project_modal_deadline_row">
                <input
                  className="project_deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  placeholder="Deadline"
                />
              </div>
            </div>

            <div className="project_modal_field">
              <FieldLabel icon="fa-solid fa-check-double">Board</FieldLabel>
              <DemoSelect
                value={formData.board_id ?? ""}
                onChange={(v) => setFormData((prev) => ({ ...prev, board_id: v }))}
                ariaLabel="Project board"
                placeholder="SELECT BOARD"
                triggerStyle={{ width: "100%", height: "40px" }}
                options={[
                  { value: "", label: "SELECT BOARD", disabled: true },
                  ...INITIAL_BOARDS.map((board) => ({ value: board.id, label: board.title })),
                ]}
              />
            </div>

            <div className="project_modal_field">
              <FieldLabel icon="fa-solid fa-paperclip">Link</FieldLabel>
              <DemoInputField
                className="project_link_to_source"
                label="Type... "
                name="link_to"
                value={formData.link_to}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="project_modal_field project_modal_members">
          <div className="project_modal_members_row">
            {formData.is_owner && formData.id && (
              <button
                className="button"
                onClick={() => setMembersModalOpen(true)}
                style={{ height: "34px", padding: "0 var(--spacing-m)", whiteSpace: "nowrap", flexShrink: 0 }}
              >
                <i className="fa-solid fa-user-gear"></i> Manage members
              </button>
            )}
            <div className="project_card_members">
              {members.length > 0 ? (
                <>
                  {members.slice(0, 5).map((member, i) => (
                    <div
                      key={member.user_id}
                      title={member.name || member.email}
                      className="project_card_avatar"
                      style={{
                        backgroundColor: getAvatarColor(member.user_id),
                        marginLeft: i === 0 ? 0 : "-8px",
                        zIndex: members.length - i,
                      }}
                    >
                      {getMemberInitial(member)}
                    </div>
                  ))}
                  {members.length > 5 && (
                    <div
                      className="project_card_avatar"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        margin: "0px",
                        padding: "0px",
                        zIndex: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "var(--text-xxl)",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      +{members.length - 5}
                    </div>
                  )}
                </>
              ) : (
                <span style={{ fontSize: "var(--text-sm)", color: "var(--fg-secondary)" }}>No members</span>
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="button" id="green" onClick={handleSave} style={{ width: "60%" }}>
            <i className="fa-solid fa-sd-card"></i> Save
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {membersModalOpen && (
          <ProjectMembersModal
            projectId={formData.id}
            projectTitle={formData.title}
            ownerId={formData.user_id ?? 1}
            members={members}
            onAddMember={(email) => {
              setMembers((prev) => [
                ...prev,
                { user_id: Date.now(), name: email.split("@")[0], email, role: "MEMBER" },
              ]);
            }}
            onRemoveMember={(userId) => setMembers((prev) => prev.filter((m) => m.user_id !== userId))}
            onClose={() => setMembersModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ProjectsContextMenus from ContextMenu/ProjectsContextMenus.tsx of the app:
   right-click a project card to Open / open source code / Manage members /
   Delete it. The demo converts the viewport click position into the scaled
   container's coordinate space (scale 0.55, origin top-left). */
const ContextMenu: React.FC<{
  position: { top: number; left: number };
  onDelete: () => void;
  onEdit: () => void;
  onClose: () => void;
  onSourceCode: () => void;
  onManageMembers?: () => void;
}> = ({ position, onDelete, onEdit, onClose, onSourceCode, onManageMembers }) => (
  <motion.div
    className="context-menu"
    style={{ position: "absolute", top: position.top - 50, left: position.left, zIndex: 20 }}
    onMouseLeave={onClose}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    <button className="menu_button" onClick={onEdit}>
      <i className="fa-solid fa-pen"></i> Open
    </button>

    <button className="menu_button" onClick={onSourceCode}>
      <i className="fa-solid fa-link"></i> Source code
    </button>

    {onManageMembers && (
      <button className="menu_button" onClick={onManageMembers}>
        <i className="fa-solid fa-users"></i> Manage members
      </button>
    )}

    <div className="spacer" style={{ backgroundColor: "var(--fg)", height: "1px" }}></div>

    <button className="menu_button" onClick={onDelete}>
      <i className="fa-solid fa-trash"></i> Delete
    </button>
  </motion.div>
);

const ProjectsTab: React.FC = () => {
  const [projects, setProjects] = useState<DemoProject[]>(INITIAL_PROJECTS);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editingProject, setEditingProject] = useState<DemoProject | null>(null);
  const [contextMenu, setContextMenu] = useState<{ project: DemoProject; position: { top: number; left: number } } | null>(null);
  const [membersProject, setMembersProject] = useState<DemoProject | null>(null);

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
      created_at: new Date().toISOString().slice(0, 10),
      deadline: new Date().toISOString().slice(0, 10),
      priority: "low",
      status: "Planned",
      is_owner: true,
      user_id: 1,
      members: [],
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const handleReorder = (from: number, to: number) => {
    if (from === to) return;
    setProjects((prev) => arrayMove(prev, from, to));
    setSortBy("");
  };

  const openProjectContextMenu = (project: DemoProject) => (e: React.MouseEvent) => {
    e.preventDefault();
    const demo = (e.currentTarget as HTMLElement).closest(".owl-demo") as HTMLElement | null;
    if (!demo) return;
    const rect = demo.getBoundingClientRect();
    const scale = rect.width > 0 && demo.offsetWidth > 0 ? rect.width / demo.offsetWidth : 1;
    setContextMenu({
      project,
      position: {
        top: (e.clientY - rect.top) / scale,
        left: (e.clientX - rect.left) / scale,
      },
    });
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setContextMenu(null);
  };

  const handleOpenSourceCode = (project: DemoProject) => {
    if (project.link_to) window.open(project.link_to, "_blank", "noopener,noreferrer");
    setContextMenu(null);
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
            onContextMenu={openProjectContextMenu(project)}
          />
        ))}
      </div>
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            position={contextMenu.position}
            onEdit={() => {
              setEditingProject(contextMenu.project);
              setContextMenu(null);
            }}
            onSourceCode={() => handleOpenSourceCode(contextMenu.project)}
            onManageMembers={() => {
              setMembersProject(contextMenu.project);
              setContextMenu(null);
            }}
            onDelete={() => handleDeleteProject(contextMenu.project.id)}
            onClose={() => setContextMenu(null)}
          />
        )}
      </AnimatePresence>
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
      <AnimatePresence>
        {membersProject && (
          <ProjectMembersModal
            projectId={membersProject.id}
            projectTitle={membersProject.title}
            ownerId={membersProject.user_id ?? 1}
            members={membersProject.members ?? []}
            onAddMember={(email) =>
              setProjects((prev) =>
                prev.map((p) =>
                  p.id === membersProject.id
                    ? {
                        ...p,
                        members: [
                          ...(p.members ?? []),
                          { user_id: Date.now(), name: email.split("@")[0], email, role: "MEMBER" },
                        ],
                      }
                    : p,
                ),
              )
            }
            onRemoveMember={(userId) =>
              setProjects((prev) =>
                prev.map((p) =>
                  p.id === membersProject.id
                    ? { ...p, members: (p.members ?? []).filter((m) => m.user_id !== userId) }
                    : p,
                ),
              )
            }
            onClose={() => setMembersProject(null)}
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
      <div className="inner-container">
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

/* --------------------------------- Account -------------------------------- */
/* Mirrors Account/AccountComponents.tsx + SubscriptionPlans.tsx (logged-in,
   Pro subscription). The demo renders the AccountControl action list with the
   subscription-plan modal fed by hardcoded plans (no backend). */

interface DemoSubscriptionPlan {
  id: number;
  name: string;
  about: string | null;
  price: number | null;
}

const DEMO_SUBSCRIPTION_PLANS: DemoSubscriptionPlan[] = [
  { id: 1, name: "Starter", about: "For individuals starting out", price: 4.99 },
  { id: 2, name: "Pro", about: "Everything you need for power users", price: 9.99 },
  { id: 3, name: "Enterprise", about: "For teams and organizations", price: null },
];

const SubPlanCard: React.FC<DemoSubscriptionPlan> = ({ name, about, price }) => (
  <motion.button
    className="subs-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="subs-card-name">{name}</h3>
    <div className="subs-card-price">
      <span className="subs-card-price-value">{price ?? "—"}</span>
      <span className="subs-card-price-currency">$/mo</span>
    </div>
    {about && <p className="subs-card-about">{about}</p>}
  </motion.button>
);

const SubscriptionPlanModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <motion.div
      className="modal"
      style={{ height: "100%", width: "100%", zIndex: 1000, background: "var(--bg)", userSelect: "none", padding: "0px", margin: "0px" }}
      initial={{ opacity: 0, y: -100 }}
      exit={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="login_modal centered_content" style={{ overflowY: "auto", gap: 0 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "900px",
            minWidth: 0,
            boxSizing: "border-box",
            gap: "var(--spacing-m)",
          }}
        >
          <div className="subs-grid">
            {DEMO_SUBSCRIPTION_PLANS.map((sub) => (
              <SubPlanCard key={sub.id} {...sub} />
            ))}
          </div>
          <div style={{ display: "flex", gap: "var(--spacing-s)", justifyContent: "center", width: "100%", padding: "0px", margin: "0px" }}>
            <button className="button" onClick={onClose} style={{ width: "100%", margin: "0px" }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AccountControl: React.FC<{ onOpenSubPlan: () => void }> = ({ onOpenSubPlan }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "var(--bg2)",
      width: "100%",
      borderRadius: "var(--border-radius-l)",
      padding: "var(--spacing-l)",
    }}
  >
    <button className="menu_button" onClick={onOpenSubPlan}>
      Change subscription plan
    </button>
    <button className="menu_button" onClick={() => undefined}>
      Change email
    </button>
    <button className="menu_button" onClick={() => undefined}>
      Change password
    </button>
    <button className="menu_button" style={{ color: "var(--red)" }}>
      Logout
    </button>
    <button className="menu_button" style={{ color: "var(--red)" }}>
      Delete account
    </button>
  </div>
);

const AccountTab: React.FC = () => {
  const [isChangeSubOpen, setIsChangeSubOpen] = useState(false);
  return (
    <div
      className="tab-content centered_content"
      id="account_block"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--spacing-l)" }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignContent: "center", alignItems: "center", justifyContent: "center", gap: "var(--spacing-l)" }}>
        <div className="account_info_grid">
          <div className="account_info_block centered_content" style={{ backgroundColor: "var(--bg2)" }}>
            <div
              style={{
                width: "100%",
                height: "40px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignContent: "center",
                alignItems: "center",
              }}
            ></div>
            <i className="fa-regular fa-circle-user centered_content" style={{ fontSize: "200px", padding: "0px", margin: "0px", flex: "1" }} />
            <button className="username" style={{ cursor: "text", color: "var(--fg)" }} onClick={() => undefined}>
              @nighty
            </button>
            <p style={{ fontSize: "medium", fontWeight: "bolder", opacity: "0.7" }}>nighty@owl.app</p>
          </div>
          <div className="account_info_block" style={{ backgroundColor: "var(--bg2)" }}>
            <div className="spacer" style={{ height: "40px" }}></div>
            <h1 className="centered_content" style={{ fontSize: "120px", flex: "1" }}>
              $9.99
            </h1>
            <p className="username" style={{ fontSize: "x-large", fontWeight: "bolder" }}>
              Pro
            </p>
            <p style={{ fontSize: "medium", fontWeight: "bolder", opacity: "0.7" }}>Days before: 27</p>
          </div>
        </div>
        <AccountControl onOpenSubPlan={() => setIsChangeSubOpen(true)} />
      </div>
      <AnimatePresence>
        {isChangeSubOpen && <SubscriptionPlanModal isOpen={isChangeSubOpen} onClose={() => setIsChangeSubOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

/* -------------------------------- Settings --------------------------------- */
/* Mirrors Settings/SettingsComponents.tsx (all blocks, static controls).     */

const SettingsTab: React.FC = () => (
  <div className="tab-content" id="settings_block">
    <div className="settings_content">
      <div className="inner-container">
        <div style={{ width: "100%", maxWidth: "600px" }}>
          <div>
            <h2 className="settings_block_title">
              <i className="fa-solid fa-user"></i> Account
            </h2>
            <div className="settings_item" style={{ width: "100%" }}>
              <label className="settings_item_title" htmlFor="public_account_checkbox">
                <i className="fa-solid fa-user"></i> Public account
              </label>
              <input id="public_account_checkbox" type="checkbox" className="checkbox" defaultChecked />
            </div>
          </div>
          <div>
            <h2 className="settings_block_title">
              <i className="fa-solid fa-swatchbook"></i> Appearance
            </h2>
            <div className="settings_item">
              <p className="settings_item_title">
                <i className="fa-solid fa-brush"></i> Theme
              </p>
              <select defaultValue="">
                <option value="" disabled>
                  Select theme
                </option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className="settings_item">
              <p className="settings_item_title">
                <i className="fa-solid fa-brush"></i> Font
              </p>
              <select defaultValue="Roboto">
                <option value="" disabled>
                  Select font
                </option>
                {["Merienda", "Caveat", "Gochi Hand", "Noto Sans", "Noto Serif", "Roboto Condensed", "Roboto", "Space Grotesk", "Ubuntu Mono", "Ubuntu", "system-ui"].map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <h2 className="settings_block_title">
              <i className="fa-solid fa-gears"></i> General
            </h2>
            <div className="settings_item">
              <p className="settings_item_title">
                <i className="fa-solid fa-earth-americas"></i> Language
              </p>
              <select id="language_list" defaultValue="en">
                {[
                  { code: "en", label: "English" },
                  { code: "ru", label: "Русский" },
                  { code: "ja", label: "日本語" },
                  { code: "de", label: "Deutsch" },
                  { code: "es", label: "Español" },
                ].map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="settings_item" style={{ width: "100%" }}>
              <label className="settings_item_title" htmlFor="animations_checkbox">
                <i className="fa-solid fa-arrows-left-right-to-line"></i> Disable animations (restart)
              </label>
              <input id="animations_checkbox" type="checkbox" className="checkbox" defaultChecked />
            </div>
          </div>
          <div>
            <h2 className="settings_block_title">
              <i className="fa-solid fa-clock"></i> Pomodoro
            </h2>
            <div className="settings_item" style={{ width: "100%" }}>
              <label className="settings_item_title">
                <i className="fa-solid fa-briefcase"></i> Work time
              </label>
              <input type="number" defaultValue={25} style={{ width: "100%" }} min="1" />
            </div>
            <div className="settings_item" style={{ width: "100%" }}>
              <label className="settings_item_title">
                <i className="fa-solid fa-bed"></i> Break time
              </label>
              <input type="number" defaultValue={5} style={{ width: "100%" }} min="1" />
            </div>
          </div>
          <div>
            <h2 className="settings_block_title">
              <i className="fa-solid fa-clock"></i> Contacts
            </h2>
            <div className="settings_item" style={{ width: "100%" }}>
              <label className="settings_item_title">
                <i className="fa-brands fa-telegram"></i> Support
              </label>
              <button className="button" onClick={() => undefined}>
                Support chat
              </button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-s)" }}>
            <h2 className="settings_block_title">
              <i className="fa-solid fa-rotate"></i> Updates
            </h2>
            <div className="settings_item">
              <button className="button" style={{ width: "100%" }} onClick={() => undefined}>
                <i className="fa-solid fa-rotate-right" /> Check for updates
              </button>
            </div>
            <div className="settings_item">
              <button className="button" style={{ width: "100%" }} onClick={() => undefined}>
                <i className="fa-solid fa-file-lines" /> Third party notices
              </button>
            </div>
            <p className="version centered_content" style={{ textAlign: "center", opacity: "0.6" }}>
              App version: 1.3.2-alpha
            </p>
          </div>
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
      case "account":
        return <AccountTab />;
      case "settings":
        return <SettingsTab />;
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
