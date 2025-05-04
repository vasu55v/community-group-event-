// filepath: f:\assignment 2\community\src\app\GroupEventPlanner.tsx
"use client";

import { useState } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ArrowUp,
  ArrowDown,
  Calendar as CalendarIcon,
  Search,
  Plus,
  Star,
  Trash2,
  MessageCircle,
  Users,
  AlertTriangle,
  Check,
  X,
  Sun,
  Moon,
} from "lucide-react";
import "react-calendar/dist/Calendar.css";
import { motion, AnimatePresence } from "framer-motion";
// import { Sun as sunIcon } from "lucide-react";
import { MessageCircle as MessageIcon } from "lucide-react";
// import { Moon as moonIcon } from "lucide-react";
// import { X as xIcon } from "lucide-react";

// Updated mock users with valid avatar URLs
const mockUsers = [
  {
    id: 1,
    name: "Alice",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "Organizer",
    color: "#4f46e5",
  },
  {
    id: 2,
    name: "Bob",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    role: "Member",
    color: "#10b981",
  },
  {
    id: 3,
    name: "Charlie",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    role: "Member",
    color: "#f59e0b",
  },
  {
    id: 4,
    name: "Dana",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    role: "Guest",
    color: "#ef4444",
  },
  {
    id: 5,
    name: "Elena",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    role: "Member",
    color: "#8b5cf6",
  },
  {
    id: 6,
    name: "Frank",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    role: "Guest",
    color: "#ec4899",
  },
];

// Color palette for the application
const colorPalette = {
  light: {
    primary: "#4f46e5", // Indigo
    secondary: "#8b5cf6", // Purple
    accent: "#0ea5e9", // Sky blue
    success: "#10b981", // Green
    warning: "#f59e0b", // Amber
    error: "#ef4444", // Red
    background: "#f9fafb",
    card: "#ffffff",
    text: "#1f2937",
    border: "#e5e7eb",
  },
  dark: {
    primary: "#6366f1", // Lighter indigo for dark mode
    secondary: "#a78bfa", // Lighter purple for dark mode
    accent: "#38bdf8", // Lighter sky blue for dark mode
    success: "#34d399", // Lighter green for dark mode
    warning: "#fbbf24", // Lighter amber for dark mode
    error: "#f87171", // Lighter red for dark mode
    background: "#1f2937",
    card: "#374151",
    text: "#f9fafb",
    border: "#4b5563",
  },
};

// Event categories with colors
const eventCategories = [
  { name: "Social", color: "#4f46e5" },
  { name: "Work", color: "#ef4444" },
  { name: "Sports", color: "#10b981" },
  { name: "Education", color: "#f59e0b" },
  { name: "Other", color: "#8b5cf6" },
];

// Initial events with more details
const initialEvents = [
  {
    id: 1,
    title: "Hiking Trip",
    date: new Date(),
    category: "Sports",
    location: "Mountain Trail Park",
    attendees: ["Alice", "Bob"],
    suggestions: ["Bring water bottles", "Start early to avoid heat"],
    notes:
      "Meet at the parking lot by 8AM. The hike is moderate difficulty, about 5 miles.",
    priority: "high",
    comments: [
      {
        user: "Alice",
        text: "I can bring some trail mix for everyone!",
        timestamp: new Date().toISOString(),
      },
    ],
    reminderSet: true,
  },
  {
    id: 2,
    title: "Team Meeting",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    category: "Work",
    location: "Conference Room B",
    attendees: ["Alice", "Charlie", "Dana"],
    suggestions: ["Prepare quarterly reports", "Bring project proposals"],
    notes: "Monthly review of all ongoing projects.",
    priority: "medium",
    comments: [],
    reminderSet: false,
  },
];

export default function GroupEventPlanner() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Social");
  const [location, setLocation] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [note, setNote] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMethod, setSortMethod] = useState("date"); // 'date', 'title', 'priority'
  const [sortDirection, setSortDirection] = useState("asc");
  const [priority, setPriority] = useState("medium");
  const [filterCategory, setFilterCategory] = useState("All");
  const [comment, setComment] = useState("");
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState("calendar"); // 'calendar', 'list', 'board'
  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: string }[]
  >([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Custom palette based on dark mode
  const palette = darkMode ? colorPalette.dark : colorPalette.light;

  // Create notification function
  const addNotification = (message: string, type = "info") => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setNotifications((current) => current.filter((n) => n.id !== id));
    }, 5000);
  };

  // Handle notifications clearing
  const clearNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Add event handler
  const handleAddEvent = () => {
    if (!title.trim()) {
      addNotification("Please enter an event title", "error");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title,
      date: selectedDate,
      category,
      location,
      attendees: [],
      suggestions: suggestion ? [suggestion] : [],
      notes: note,
      priority,
      comments: [],
      reminderSet: false,
    };

    setEvents([...events, newEvent]);
    addNotification(`Event "${title}" created successfully!`, "success");

    // Reset form
    setTitle("");
    setCategory("Social");
    setLocation("");
    setSuggestion("");
    setNote("");
    setPriority("medium");
  };

  // RSVP handler
  const handleRSVP = (eventId: number, userName: string) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        const isAttending = event.attendees.includes(userName);
        const newAttendees = isAttending
          ? event.attendees.filter((u) => u !== userName)
          : [...event.attendees, userName];

        addNotification(
          isAttending
            ? `You removed ${userName} from "${event.title}"`
            : `${userName} is now attending "${event.title}"`,
          "info"
        );

        return {
          ...event,
          attendees: newAttendees,
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  // Delete event handler
  const handleDeleteEvent = (eventId: number) => {
    const eventToDelete = events.find((e) => e.id === eventId);
    if (!eventToDelete) return;

    setEvents(events.filter((event) => event.id !== eventId));
    addNotification(`Event "${eventToDelete.title}" deleted`, "warning");
  };

  // Add comment handler
  const handleAddComment = (eventId: number) => {
    if (!comment.trim()) return;

    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        const newComment = {
          user: "You", // In a real app, this would be the current user
          text: comment,
          timestamp: new Date().toISOString(),
        };

        return {
          ...event,
          comments: [...event.comments, newComment],
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    setComment("");
    addNotification("Comment added", "success");
  };

  // Toggle reminder status
  const toggleReminder = (eventId: number) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        const newStatus = !event.reminderSet;

        addNotification(
          newStatus
            ? `Reminder set for "${event.title}"`
            : `Reminder removed for "${event.title}"`,
          "info"
        );

        return {
          ...event,
          reminderSet: newStatus,
        };
      }
      return event;
    });

    setEvents(updatedEvents);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    addNotification(`Switched to ${!darkMode ? "dark" : "light"} mode`, "info");
  };

  // Handle sort direction toggle
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Get category color
  const getCategoryColor = (categoryName: string) => {
    const category = eventCategories.find((c) => c.name === categoryName);
    return category ? category.color : "#8b5cf6"; // Default purple
  };

  // Priority styles
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high":
        return { color: palette.error, icon: <AlertTriangle size={16} /> };
      case "medium":
        return { color: palette.warning, icon: <Star size={16} /> };
      case "low":
        return { color: palette.success, icon: <Check size={16} /> };
      default:
        return { color: palette.warning, icon: <Star size={16} /> };
    }
  };

  // Filter events based on search term and category
  const filteredEvents = events.filter(
    (event) =>
      (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(event.date)
          .toDateString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (filterCategory === "All" || event.category === filterCategory)
  );

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    let comparison = 0;

    switch (sortMethod) {
      case "date":
        comparison = dateA.getTime() - dateB.getTime();
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "priority":
        const priorityValues: Record<"high" | "medium" | "low", number> = {
          high: 3,
          medium: 2,
          low: 1,
        };
        comparison =
          priorityValues[b.priority as "high" | "medium" | "low"] -
          priorityValues[a.priority as "high" | "medium" | "low"];
        break;
      default:
        comparison = dateA.getTime() - dateB.getTime();
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Attendance statistics for pie chart
  const attendanceStats = eventCategories.map((category) => {
    const eventsInCategory = events.filter((e) => e.category === category.name);
    const totalAttendees = eventsInCategory.reduce(
      (sum, event) => sum + event.attendees.length,
      0
    );

    return {
      name: category.name,
      value: totalAttendees || 0,
      color: category.color,
    };
  });

  // Custom Calendar tile content
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const eventsOnDate = events.filter(
      (e) => new Date(e.date).toDateString() === date.toDateString()
    );

    if (eventsOnDate.length === 0) return null;

    return (
      <div className="flex flex-wrap justify-center">
        {eventsOnDate.slice(0, 3).map((event, idx) => (
          <div
            key={idx}
            className="w-2 h-2 rounded-full mx-px"
            style={{ backgroundColor: getCategoryColor(event.category) }}
            title={event.title}
          />
        ))}
        {eventsOnDate.length > 3 && (
          <span
            className="text-xs font-bold"
            style={{ color: palette.primary }}
          >
            +{eventsOnDate.length - 3}
          </span>
        )}
      </div>
    );
  };

  return (
    <main
      className={`transition-colors duration-500 min-h-screen p-6 font-sans`}
      style={{
        backgroundColor: palette.background,
        color: palette.text,
      }}
    >
      {/* Header */}

      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left text-4xl md:text-5xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})`,
            }}
          >
            <span className="block">Group Event Planner</span>
          </motion.h1>
        </motion.div>

        {/* Right controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full shadow-md transition hover:scale-105"
            style={{
              backgroundColor: palette.primary,
              color: "white",
            }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full relative shadow-md hover:scale-105 transition"
              style={{
                backgroundColor: notifications.length
                  ? palette.warning
                  : palette.secondary,
                color: "white",
              }}
            >
              <MessageIcon size={20} />
              {notifications.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold bg-red-500 text-white"
                >
                  {notifications.length}
                </motion.span>
              )}
            </motion.button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-0 mt-3 w-72 max-h-80 overflow-y-auto rounded-lg shadow-xl z-50 p-3 border"
                  style={{
                    backgroundColor: palette.card,
                    borderColor: palette.border,
                  }}
                >
                  <h3 className="text-base font-semibold mb-2 p-2">
                    Notifications
                  </h3>

                  {notifications.length === 0 ? (
                    <p className="text-sm italic text-center text-gray-500">
                      No notifications
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-2 rounded-md flex justify-between items-start text-sm"
                          style={{
                            backgroundColor:
                              notification.type === "error"
                                ? "rgba(239, 68, 68, 0.1)"
                                : notification.type === "warning"
                                ? "rgba(245, 158, 11, 0.1)"
                                : notification.type === "success"
                                ? "rgba(16, 185, 129, 0.1)"
                                : "rgba(79, 70, 229, 0.1)",
                            borderLeft: `4px solid ${
                              notification.type === "error"
                                ? palette.error
                                : notification.type === "warning"
                                ? palette.warning
                                : notification.type === "success"
                                ? palette.success
                                : palette.primary
                            }`,
                          }}
                        >
                          <span>{notification.message}</span>
                          <button
                            onClick={() => clearNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setNotifications([])}
                        className="w-full p-1 text-sm rounded-md text-center mt-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                        style={{
                          backgroundColor: palette.border,
                          color: palette.text,
                        }}
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </header>

      {/* Search & View Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="🔍 Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg shadow transition-colors duration-300"
            style={{
              backgroundColor: palette.card,
              borderColor: palette.border,
              color: palette.text,
            }}
          />
          <Search className="absolute left-3 top-3 opacity-50" size={20} />
        </div>

        <div className="flex gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 rounded-lg shadow transition-colors duration-300"
            style={{
              backgroundColor: palette.card,
              borderColor: palette.border,
              color: palette.text,
            }}
          >
            <option value="All">All Categories</option>
            {eventCategories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex rounded-lg shadow overflow-hidden">
            <button
              onClick={() => setViewMode("calendar")}
              className="p-2 transition-colors duration-300"
              style={{
                backgroundColor:
                  viewMode === "calendar" ? palette.primary : palette.card,
                color: viewMode === "calendar" ? "white" : palette.text,
              }}
            >
              <CalendarIcon size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className="p-2 transition-colors duration-300"
              style={{
                backgroundColor:
                  viewMode === "list" ? palette.primary : palette.card,
                color: viewMode === "list" ? "white" : palette.text,
              }}
            >
              <ul className="list" />
            </button>
            <button
              onClick={() => setViewMode("board")}
              className="p-2 transition-colors duration-300"
              style={{
                backgroundColor:
                  viewMode === "board" ? palette.primary : palette.card,
                color: viewMode === "board" ? "white" : palette.text,
              }}
            >
              <Users size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar & Event Creation Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Calendar */}
          <section
            className="p-6 rounded-2xl shadow-lg"
            style={{
              backgroundColor: palette.card,
              borderColor: palette.border,
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: palette.primary }}
            >
              <CalendarIcon className="inline mr-2" size={20} /> Interactive
              Calendar
            </h2>
            <div
              className={`calendar-container ${
                darkMode ? "dark-calendar" : ""
              }`}
            >
              <Calendar
                value={selectedDate}
                onChange={(value) => {
                  if (value instanceof Date) {
                    setSelectedDate(value);
                  }
                }}
                tileContent={tileContent}
                className="rounded border"
              />
            </div>
          </section>

          {/* Event Creation */}
          <section
            className="p-6 rounded-2xl shadow-lg"
            style={{
              backgroundColor: palette.card,
              borderColor: palette.border,
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: palette.primary }}
            >
              <Plus className="inline mr-2" size={20} /> Create New Event
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title"
                  className="w-full p-2 rounded"
                  style={{
                    backgroundColor: darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    color: palette.text,
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Category
    </label>
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="w-full p-2.5 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
    >
      {eventCategories.map((cat) => (
        <option key={cat.name} value={cat.name} className="bg-white dark:bg-gray-700">
          {cat.name}
        </option>
      ))}
    </select>
  </div>
  
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Priority
    </label>
    <select
      value={priority}
      onChange={(e) => setPriority(e.target.value)}
      className="w-full p-2.5 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
    >
      <option value="high" className="bg-white dark:bg-gray-700">High</option>
      <option value="medium" className="bg-white dark:bg-gray-700">Medium</option>
      <option value="low" className="bg-white dark:bg-gray-700">Low</option>
    </select>
  </div>
</div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Event location"
                  className="w-full p-2 rounded"
                  style={{
                    backgroundColor: darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    color: palette.text,
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Suggestion
                </label>
                <input
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Add a suggestion"
                  className="w-full p-2 rounded"
                  style={{
                    backgroundColor: darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    color: palette.text,
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Event notes"
                  className="w-full p-2 rounded h-24"
                  style={{
                    backgroundColor: darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    color: palette.text,
                  }}
                ></textarea>
              </div>

              <button
                onClick={handleAddEvent}
                className="w-full py-2 rounded-lg font-medium flex items-center justify-center mt-2"
                style={{ backgroundColor: palette.primary, color: "white" }}
              >
                <Plus size={18} className="mr-1" /> Create Event
              </button>
            </div>
          </section>
        </div>

        {/* Events Display */}
        <div className="lg:col-span-2">
          <section
            className="p-6 rounded-2xl shadow-lg mb-6"
            style={{
              backgroundColor: palette.card,
              borderColor: palette.border,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-semibold"
                style={{ color: palette.primary }}
              >
                {viewMode === "calendar"
                  ? "Upcoming Events"
                  : viewMode === "list"
                  ? "Events List"
                  : "Event Board"}
              </h2>

              <div className="flex items-center gap-2">
                <select
                  value={sortMethod}
                  onChange={(e) => setSortMethod(e.target.value)}
                  className="p-1 text-sm rounded"
                  style={{
                    backgroundColor: darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    color: palette.text,
                  }}
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="priority">Sort by Priority</option>
                </select>

                <button onClick={toggleSortDirection} className="p-1">
                  {sortDirection === "asc" ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}
                </button>
              </div>
            </div>

            {sortedEvents.length === 0 ? (
              <div
                className="p-8 text-center rounded"
                style={{
                  backgroundColor: darkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                }}
              >
                <p className="text-lg font-medium">No events found</p>
                <p className="text-sm opacity-70">
                  Create a new event or change your filters
                </p>
              </div>
            ) : viewMode === "board" ? (
              // Board View
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg shadow-sm overflow-hidden flex flex-col"
                    style={{
                      borderLeft: `4px solid ${getCategoryColor(
                        event.category
                      )}`,
                      backgroundColor: darkMode
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.02)",
                    }}
                  >
                    <div className="p-3 flex justify-between items-start">
                      <div>
                        <h3
                          className="font-bold"
                          style={{ color: palette.primary }}
                        >
                          {event.title}
                        </h3>
                        <p
                          className="text-xs"
                          style={{ color: "rgba(107, 114, 128, 0.8)" }}
                        >
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleReminder(event.id)}
                          className="text-xs p-1 rounded"
                          style={{
                            color: event.reminderSet
                              ? palette.warning
                              : "rgba(107, 114, 128, 0.8)",
                          }}
                          title={
                            event.reminderSet
                              ? "Remove reminder"
                              : "Set reminder"
                          }
                        >
                          <Star
                            size={16}
                            fill={event.reminderSet ? palette.warning : "none"}
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-xs p-1 rounded"
                          style={{ color: palette.error }}
                          title="Delete event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="px-3 pb-3 flex-grow">
                      <div className="flex items-center gap-1 mb-2">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: getCategoryColor(event.category),
                          }}
                        ></span>
                        <span className="text-xs">{event.category}</span>

                        <div className="flex items-center ml-2">
                          <span
                            className="inline-flex items-center text-xs"
                            style={{
                              color: getPriorityStyle(event.priority).color,
                            }}
                          >
                            {getPriorityStyle(event.priority).icon}
                            <span className="ml-1">{event.priority}</span>
                          </span>
                        </div>
                      </div>

                      {event.location && (
                        <p className="text-xs mb-2 italic">
                          📍 {event.location}
                        </p>
                      )}
                    </div>

                    <div
                      className="p-3 mt-auto"
                      style={{
                        backgroundColor: darkMode
                          ? "rgba(0,0,0,0.2)"
                          : "rgba(0,0,0,0.05)",
                      }}
                    >
                      <h4 className="text-xs font-medium mb-1">
                        Attendees ({event.attendees.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {mockUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => handleRSVP(event.id, user.name)}
                            className="p-1 rounded-full border-2 transition-all duration-300"
                            style={{
                              borderColor: event.attendees.includes(user.name)
                                ? user.color
                                : "transparent",
                              opacity: event.attendees.includes(user.name)
                                ? 1
                                : 0.5,
                            }}
                            title={`${user.name} (${user.role})`}
                          >
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-6 h-6 rounded-full"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : viewMode === "list" ? (
              // List View
              <div className="space-y-3">
                {sortedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg shadow-sm overflow-hidden transition-all duration-300"
                    style={{
                      backgroundColor:
                        expandedEvent === event.id
                          ? darkMode
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.05)"
                          : darkMode
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.02)",
                      borderLeft: `4px solid ${getCategoryColor(
                        event.category
                      )}`,
                    }}
                  >
                    <div
                      className="p-3 flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        setExpandedEvent(
                          expandedEvent === event.id ? null : event.id
                        )
                      }
                    >
                      <div className="flex items-center">
                        <div className="mr-3">
                          {getPriorityStyle(event.priority).icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="flex items-center gap-2 text-xs">
                            <span>
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <span
                                className="inline-block w-2 h-2 rounded-full mr-1"
                                style={{
                                  backgroundColor: getCategoryColor(
                                    event.category
                                  ),
                                }}
                              ></span>
                              {event.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.reminderSet && (
                          <Star size={16} fill={palette.warning} />
                        )}
                        <span
                          className="px-2 py-1 text-xs rounded"
                          style={{
                            backgroundColor: darkMode
                              ? "rgba(0,0,0,0.2)"
                              : "rgba(0,0,0,0.05)",
                          }}
                        >
                          {event.attendees.length} attendees
                        </span>
                      </div>
                    </div>

                    {expandedEvent === event.id && (
                      <div
                        className="p-3 border-t"
                        style={{ borderColor: palette.border }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            {event.location && (
                              <p className="text-sm mb-2">
                                <span className="font-medium">Location:</span>{" "}
                                {event.location}
                              </p>
                            )}
                            {event.notes && (
                              <p className="text-sm mb-2">
                                <span className="font-medium">Notes:</span>{" "}
                                {event.notes}
                              </p>
                            )}
                            {event.suggestions.length > 0 && (
                              <div className="mb-2">
                                <span className="text-sm font-medium">
                                  Suggestions:
                                </span>
                                <ul className="list-disc pl-5 text-sm">
                                  {event.suggestions.map((s, idx) => (
                                    <li key={idx}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="mb-3">
                              <h4 className="text-sm font-medium mb-1">
                                Attendees
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {mockUsers.map((user) => (
                                  <button
                                    key={user.id}
                                    onClick={() =>
                                      handleRSVP(event.id, user.name)
                                    }
                                    className="flex items-center p-1 rounded transition-all duration-300"
                                    style={{
                                      backgroundColor: event.attendees.includes(
                                        user.name
                                      )
                                        ? `${user.color}20` // With opacity
                                        : "transparent",
                                      color: event.attendees.includes(user.name)
                                        ? user.color
                                        : palette.text,
                                    }}
                                  >
                                    <img
                                      src={user.avatar}
                                      alt={user.name}
                                      className="w-6 h-6 rounded-full mr-1"
                                    />
                                    <span className="text-xs">{user.name}</span>
                                    {event.attendees.includes(user.name) ? (
                                      <Check size={14} className="ml-1" />
                                    ) : (
                                      <Plus size={14} className="ml-1" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleReminder(event.id)}
                                className="text-xs px-2 py-1 rounded flex items-center"
                                style={{
                                  backgroundColor: event.reminderSet
                                    ? `${palette.warning}20`
                                    : darkMode
                                    ? "rgba(255,255,255,0.05)"
                                    : "rgba(0,0,0,0.05)",
                                  color: event.reminderSet
                                    ? palette.warning
                                    : palette.text,
                                }}
                              >
                                <Star
                                  size={14}
                                  className="mr-1"
                                  fill={
                                    event.reminderSet ? palette.warning : "none"
                                  }
                                />
                                {event.reminderSet
                                  ? "Remove Reminder"
                                  : "Set Reminder"}
                              </button>

                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="text-xs px-2 py-1 rounded flex items-center"
                                style={{
                                  backgroundColor: darkMode
                                    ? "rgba(255,255,255,0.05)"
                                    : "rgba(0,0,0,0.05)",
                                  color: palette.error,
                                }}
                              >
                                <Trash2 size={14} className="mr-1" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Comments Section */}
                        <div
                          className="mt-4 pt-3 border-t"
                          style={{ borderColor: palette.border }}
                        >
                          <h4 className="text-sm font-medium mb-2">
                            Comments ({event.comments.length})
                          </h4>

                          <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                            {event.comments.map((comment, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded text-sm"
                                style={{
                                  backgroundColor: darkMode
                                    ? "rgba(0,0,0,0.2)"
                                    : "rgba(0,0,0,0.05)",
                                }}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-medium">
                                    {comment.user}
                                  </span>
                                  <span className="text-xs opacity-70">
                                    {new Date(
                                      comment.timestamp
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <p>{comment.text}</p>
                              </div>
                            ))}
                            {event.comments.length === 0 && (
                              <p className="text-sm italic opacity-70">
                                No comments yet
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Add a comment..."
                              className="flex-grow p-2 text-sm rounded"
                              style={{
                                backgroundColor: darkMode
                                  ? "rgba(255,255,255,0.05)"
                                  : "rgba(0,0,0,0.05)",
                                color: palette.text,
                              }}
                            />
                            <button
                              onClick={() => handleAddComment(event.id)}
                              disabled={!comment.trim()}
                              className="px-3 py-1 rounded text-sm"
                              style={{
                                backgroundColor: comment.trim()
                                  ? palette.primary
                                  : palette.border,
                                color: comment.trim() ? "white" : palette.text,
                                opacity: comment.trim() ? 1 : 0.7,
                              }}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Calendar View (Default)
              <div className="space-y-4">
                {sortedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-xl shadow overflow-hidden flex flex-col md:flex-row"
                    style={{
                      backgroundColor: darkMode
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.02)",
                    }}
                  >
                    <div
                      className="p-4 md:w-1/4 flex flex-col items-center justify-center"
                      style={{
                        backgroundColor: getCategoryColor(event.category),
                        color: "white",
                      }}
                    >
                      <div className="text-center">
                        <p className="text-xl font-bold">
                          {new Date(event.date).getDate()}
                        </p>
                        <p className="text-sm">
                          {new Date(event.date).toLocaleString("default", {
                            month: "short",
                          })}
                        </p>
                        <p className="mt-2 text-xs font-medium">
                          {event.category}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3
                            className="font-bold text-lg"
                            style={{ color: palette.primary }}
                          >
                            {event.title}
                          </h3>
                          {event.location && (
                            <p
                              className="text-sm"
                              style={{ color: "rgba(107, 114, 128, 0.8)" }}
                            >
                              📍 {event.location}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span
                            className="px-2 py-1 text-xs rounded-full flex items-center"
                            style={{
                              backgroundColor:
                                getPriorityStyle(event.priority).color + "20", // with opacity
                              color: getPriorityStyle(event.priority).color,
                            }}
                          >
                            {getPriorityStyle(event.priority).icon}
                            <span className="ml-1">{event.priority}</span>
                          </span>
                        </div>
                      </div>

                      {event.notes && (
                        <p className="mt-2 text-sm">{event.notes}</p>
                      )}

                      {event.suggestions.length > 0 && (
                        <div className="mt-3">
                          <h4
                            className="text-xs font-semibold mb-1"
                            style={{ color: palette.secondary }}
                          >
                            💡 Suggestions
                          </h4>
                          <ul className="list-disc pl-5 text-sm">
                            {event.suggestions.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div
                      className="p-4 md:w-1/4"
                      style={{
                        backgroundColor: darkMode
                          ? "rgba(0,0,0,0.2)"
                          : "rgba(0,0,0,0.05)",
                      }}
                    >
                      <h4
                        className="text-sm font-medium mb-2"
                        style={{ color: palette.secondary }}
                      >
                        Attendees
                      </h4>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {mockUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => handleRSVP(event.id, user.name)}
                            className="p-1 rounded-full border-2 transition-all duration-300"
                            style={{
                              borderColor: event.attendees.includes(user.name)
                                ? user.color
                                : "transparent",
                              opacity: event.attendees.includes(user.name)
                                ? 1
                                : 0.5,
                            }}
                            title={`${user.name} (${user.role})`}
                          >
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full"
                            />
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => toggleReminder(event.id)}
                          className="text-xs px-2 py-1 rounded flex items-center justify-center"
                          style={{
                            backgroundColor: event.reminderSet
                              ? `${palette.warning}20`
                              : darkMode
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.05)",
                            color: event.reminderSet
                              ? palette.warning
                              : palette.text,
                          }}
                        >
                          <Star
                            size={14}
                            className="mr-1"
                            fill={event.reminderSet ? palette.warning : "none"}
                          />
                          {event.reminderSet
                            ? "Remove Reminder"
                            : "Set Reminder"}
                        </button>

                        <button
                          onClick={() =>
                            setExpandedEvent(
                              expandedEvent === event.id ? null : event.id
                            )
                          }
                          className="text-xs px-2 py-1 rounded flex items-center justify-center"
                          style={{
                            backgroundColor:
                              expandedEvent === event.id
                                ? palette.primary
                                : darkMode
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.05)",
                            color:
                              expandedEvent === event.id
                                ? "white"
                                : palette.text,
                          }}
                        >
                          <MessageCircle size={14} className="mr-1" />
                          {event.comments.length} Comments
                        </button>

                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-xs px-2 py-1 rounded flex items-center justify-center"
                          style={{
                            backgroundColor: darkMode
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.05)",
                            color: palette.error,
                          }}
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>

                    {expandedEvent === event.id && (
                      <div
                        className="p-4 border-t w-full"
                        style={{ borderColor: palette.border }}
                      >
                        <h4 className="text-sm font-medium mb-2">
                          Comments ({event.comments.length})
                        </h4>

                        <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                          {event.comments.map((comment, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded text-sm"
                              style={{
                                backgroundColor: darkMode
                                  ? "rgba(0,0,0,0.2)"
                                  : "rgba(0,0,0,0.05)",
                              }}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">
                                  {comment.user}
                                </span>
                                <span className="text-xs opacity-70">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p>{comment.text}</p>
                            </div>
                          ))}
                          {event.comments.length === 0 && (
                            <p className="text-sm italic opacity-70">
                              No comments yet
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-grow p-2 text-sm rounded"
                            style={{
                              backgroundColor: darkMode
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.05)",
                              color: palette.text,
                            }}
                          />
                          <button
                            onClick={() => handleAddComment(event.id)}
                            disabled={!comment.trim()}
                            className="px-3 py-1 rounded text-sm"
                            style={{
                              backgroundColor: comment.trim()
                                ? palette.primary
                                : palette.border,
                              color: comment.trim() ? "white" : palette.text,
                              opacity: comment.trim() ? 1 : 0.7,
                            }}
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Dashboard/Analytics */}
          <section
            className="p-6 rounded-2xl shadow-lg"
            style={{
              backgroundColor: palette.card,
              borderColor: palette.border,
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: palette.primary }}
            >
              📊 Event Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3
                  className="text-base font-medium mb-3"
                  style={{ color: palette.secondary }}
                >
                  Attendance by Category
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={attendanceStats.filter((item) => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {attendanceStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip
                      formatter={(value) => [
                        `${value} attendees`,
                        "Attendance",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3
                  className="text-base font-medium mb-3"
                  style={{ color: palette.secondary }}
                >
                  Event Popularity
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={sortedEvents.map((e) => ({
                      name:
                        e.title.length > 10
                          ? e.title.substring(0, 10) + "..."
                          : e.title,
                      attendees: e.attendees.length,
                      color: getCategoryColor(e.category),
                    }))}
                  >
                    <XAxis dataKey="name" stroke={darkMode ? "#fff" : "#000"} />
                    <YAxis stroke={darkMode ? "#fff" : "#000"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? palette.card : "#fff",
                        color: darkMode ? "#fff" : "#000",
                        border: `1px solid ${palette.border}`,
                      }}
                    />
                    <Bar dataKey="attendees" radius={[4, 4, 0, 0]}>
                      {sortedEvents.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getCategoryColor(entry.category)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                className="p-3 rounded-lg text-center"
                style={{
                  backgroundColor: darkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                }}
              >
                <h3
                  className="text-lg font-bold"
                  style={{ color: palette.primary }}
                >
                  {events.length}
                </h3>
                <p className="text-sm">Total Events</p>
              </div>

              <div
                className="p-3 rounded-lg text-center"
                style={{
                  backgroundColor: darkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                }}
              >
                <h3
                  className="text-lg font-bold"
                  style={{ color: palette.success }}
                >
                  {events.reduce(
                    (sum, event) => sum + event.attendees.length,
                    0
                  )}
                </h3>
                <p className="text-sm">Total RSVPs</p>
              </div>

              <div
                className="p-3 rounded-lg text-center"
                style={{
                  backgroundColor: darkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                }}
              >
                <h3
                  className="text-lg font-bold"
                  style={{ color: palette.warning }}
                >
                  {events.filter((e) => e.reminderSet).length}
                </h3>
                <p className="text-sm">Reminders Set</p>
              </div>

              <div
                className="p-3 rounded-lg text-center"
                style={{
                  backgroundColor: darkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                }}
              >
                <h3
                  className="text-lg font-bold"
                  style={{ color: palette.error }}
                >
                  {events.filter((e) => e.priority === "high").length}
                </h3>
                <p className="text-sm">High Priority</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Custom styles for the calendar */}
      <style jsx global>{`
        .react-calendar {
          width: 100%;
          background: ${darkMode ? palette.card : "#fff"};
          color: ${palette.text};
          border-color: ${palette.border};
        }
        .react-calendar button {
          color: ${palette.text};
        }
        .react-calendar__tile--active {
          background: ${palette.primary} !important;
          color: white !important;
        }
        .react-calendar__tile--now {
          background: ${palette.secondary}30 !important;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: ${palette.primary}20 !important;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: ${palette.primary}20 !important;
        }
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: ${palette.primary} !important;
        }
        .react-calendar__month-view__days__day--weekend {
          color: ${darkMode ? palette.error : "#d10000"};
        }
      `}</style>
    </main>
  );
}
