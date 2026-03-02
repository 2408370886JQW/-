import { createContext, useContext, useState, ReactNode } from "react";

interface NotificationContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  clearUnread: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  setUnreadCount: () => {},
  clearUnread: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  // Initial unread count (mock: 3 unread "喜欢了你" notifications)
  const [unreadCount, setUnreadCount] = useState(3);

  const clearUnread = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount, clearUnread }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
