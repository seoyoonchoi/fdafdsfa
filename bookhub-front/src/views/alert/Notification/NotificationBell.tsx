import { Bell } from 'lucide-react'
import { useNavigate } from "react-router-dom";

interface Props {
  unreadCount: number;
}

const NotificationBell: React.FC<Props> = ({ unreadCount }) => {
  const navigate = useNavigate();

  return (
    <div className = "notification-bell" onClick={() => navigate('/alerts')}>
      <Bell size={24} />
      {unreadCount > 0 && (
        <span className = "badge">{unreadCount}</span>
      )}
    </div>
  );
};

export default NotificationBell;