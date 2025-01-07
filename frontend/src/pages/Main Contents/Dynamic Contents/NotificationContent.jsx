import { useNotifications } from "../../../context/NotificationsContext";
import { FaTrash } from "react-icons/fa"; 

const NotificationsPage = () => {
  const { notifications, clearNotifications, deleteNotification } =
    useNotifications();

  // Remove duplicates by ensuring the combination of message is unique
  const uniqueNotifications = notifications.filter(
    (notification, index, self) =>
      index === self.findIndex((n) => n.message === notification.message)
  );

  // Reverse the notifications so the latest ones are on top
  const sortedNotifications = [...uniqueNotifications].reverse();

  return (
    <div className="p-6">
      {/* Clear All Notifications */}
      <div className="mb-4 flex justify-end">
        {sortedNotifications.length > 0 && (
          <p
            onClick={clearNotifications}
            className="text-xs text-white px-4 py-2 rounded-lg shadow cursor-pointer"
          >
            Clear All Notifications
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sortedNotifications.length === 0 ? (
          <p className="col-span-full text-sm text-gray-400 text-center">
            No notifications to display.
          </p>
        ) : (
          sortedNotifications.map((notification, index) => (
            <div
              key={index}
              className="shadow-lg rounded-lg p-4 flex items-start justify-between gap-4"
            >
              {/* Details */}
              <div>
                <p className="text-sm text-gray-400">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.timestamp
                    ? new Date(notification.timestamp).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "Invalid Date"}
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteNotification(notification)}
                className="text-red-500 hover:text-red-600 transition"
                aria-label="Delete notification"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
