import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShoppingBag, CheckCheck, Clock } from 'lucide-react';
import { getAdminNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../lib/notifications';
import { AdminNotification } from '../../types/notification';

export const AdminNotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const loadNotifications = () => {
    setNotifications(getAdminNotifications());
  };

  useEffect(() => {
    loadNotifications();

    // Listen to local storage changes or intervals for live updates
    const interval = setInterval(loadNotifications, 10000);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (item: AdminNotification) => {
    markNotificationAsRead(item.id);
    loadNotifications();
    setIsOpen(false);
    navigate(`/business/orders/${item.orderId}`);
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllNotificationsAsRead();
    loadNotifications();
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diffMs / (1000 * 60));
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`;
      const days = Math.floor(hours / 24);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => {
          loadNotifications();
          setIsOpen(!isOpen);
        }}
        aria-label="Notifications"
        className="relative p-2 rounded-xl text-[#6F6A65] hover:text-[#222222] hover:bg-[#FAF7F2] border border-[#DED7CE] transition-all cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#9E2328] text-[9px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-[#DED7CE] shadow-lg z-50 overflow-hidden animate-soft-in">
          {/* Header */}
          <div className="p-4 bg-[#FAF7F2] border-b border-[#DED7CE] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#222222] uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-[#9E2328] text-white px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9E2328] hover:underline cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#DED7CE]/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-[#6F6A65]/40 mx-auto" />
                <p className="text-xs font-semibold text-[#222222]">No notifications yet</p>
                <p className="text-[11px] text-[#6F6A65]">
                  New customer orders will appear here in real time.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 sm:p-4 hover:bg-[#FAF7F2] transition-colors cursor-pointer flex items-start gap-3 ${
                    !n.read ? 'bg-brand-50/30' : ''
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      !n.read
                        ? 'bg-[#9E2328] text-white'
                        : 'bg-[#FAF7F2] text-[#6F6A65] border border-[#DED7CE]'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono font-bold text-xs text-[#9E2328]">
                        {n.orderReference}
                      </span>
                      <span className="text-[10px] text-[#6F6A65] flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-[#222222] truncate mt-0.5">
                      {n.customerName}
                    </div>

                    <div className="text-[11px] text-[#6F6A65] flex items-center gap-2 mt-0.5">
                      <span>{n.itemCount} {n.itemCount === 1 ? 'item' : 'items'}</span>
                      <span>•</span>
                      <span className="font-semibold text-[#222222]">
                        SGD {n.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-[#9E2328] flex-shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-[#FAF7F2] border-t border-[#DED7CE] text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/business/orders');
              }}
              className="text-[11px] font-bold text-[#9E2328] hover:underline"
            >
              View All Customer Orders →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
