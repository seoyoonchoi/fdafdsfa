import { getAlertTargetUrl, getUnreadAlerts, markAlertsAsRead } from '@/apis/alert/alert';
import { AlertResponseDto } from '@/dtos/alert/response/Alert.response.dto';
import { PageResponseDto } from '@/dtos/PageResponseDto';
import { useEmployeeStore } from '@/stores/employee.store';
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

function AlertPage() {
  const [pageData, setPageData] = useState<PageResponseDto<AlertResponseDto> | null>(null);
  const [selectedAlerts, setSelectedAlerts] = useState<number[]>([]);
  const [cookies] = useCookies(["accessToken"]);
  const itemsPerPage = 10;
  const pagesPerGroup = 5;
  const employee = useEmployeeStore((state) => state.employee);

  const fetchAlerts = async (page: number) => {
    if (!employee) return;
    const res = await getUnreadAlerts(employee.employeeId, cookies.accessToken, page, itemsPerPage);
    if (res.code === "SU" && res.data) {
      setPageData(res.data);
      setSelectedAlerts([]);
    }
  };

  useEffect(() => {
    fetchAlerts(0);
  }, [employee]);

  const handleCheckboxChange = (alertId: number) => {
    setSelectedAlerts((prev) =>
      prev.includes(alertId)
        ? prev.filter((id) => id !== alertId)
        : [...prev, alertId]  
    );
  };

  const handleSelectAll = () => {
    if (!pageData) return;
    if (selectedAlerts.length === pageData.content.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(pageData.content.map((a) => a.alertId));
    }
  }

  const handleMarkAsRead = async () => {
    if (selectedAlerts.length === 0) return;
    const res = await markAlertsAsRead(selectedAlerts, cookies.accessToken);
    if (res.code === "SU" && pageData) {
      fetchAlerts(pageData.currentPage);
    }
  };

  const goToPage = (page: number) => {
    if (pageData && page >= 0 && page < pageData.totalPages) {
      fetchAlerts(page);
    }
  };

  const currentGroup = Math.floor((pageData?.currentPage ?? 0) / pagesPerGroup);
  const startPage = currentGroup * pagesPerGroup;
  const endPage = Math.min(startPage + pagesPerGroup, pageData?.totalPages ?? 0);

  return (
    <div style={{ padding: "24px "}}>
      <h2>알림 목록</h2>
      <button
        onClick={handleMarkAsRead}
        disabled={selectedAlerts.length === 0}>
          읽음
      </button>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  !!pageData &&
                  selectedAlerts.length === pageData.content.length &&
                  pageData.content.length > 0
                }
                onChange={handleSelectAll}
                />
            </th>
            <th>알림 타입</th>
            <th>메시지</th>
            <th>읽음 여부</th>
            <th>수신일</th>
          </tr>
        </thead>
        <tbody>
          {pageData && pageData.content.length > 0 ? (
            pageData.content.map((alert) => (
              <tr key={alert.alertId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedAlerts.includes(alert.alertId)}
                    onChange={() => handleCheckboxChange(alert.alertId)}
                    />
                </td>
                <td>{alert.alertType}</td>
                <td style={{fontWeight:alert.isRead ? "normal" : "bold"}}>
                  {getAlertTargetUrl(alert) ? (
                    <Link
                      to={getAlertTargetUrl(alert)!}
                      style={{color: "#004080", textDecoration: "underline"}}
                      >
                        {alert.message}
                      </Link>
                  ) : (
                    alert.message
                  )}
                </td>
                <td>{alert.isRead ? "읽음" : "안읽음"}</td>
                <td>{new Date(alert.createdAt).toLocaleDateString("ko-KR")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>
                알림이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {pageData && pageData.totalPages > 0 && (
        <div>
          <button
            onClick={() => goToPage(startPage - pagesPerGroup)}
            disabled={startPage < pagesPerGroup}>
            {"<"}
          </button>
          {Array.from({length: endPage - startPage}, (_, i) => startPage + i).map((i) => (
            <button
              key={i}
              className={`pageBtn${i === pageData?.currentPage ? " current" : ""}`}
              onClick={() => goToPage(i)}>
                {i+1}
              </button>
          ))}
          <button
            onClick={() => goToPage(startPage + pagesPerGroup)}
            disabled={endPage >= (pageData?.totalPages ?? 0)}>
              {">"}
          </button>
          <span>
            {pageData?.totalPages > 0 ? `${(pageData?.currentPage ?? 0) + 1} / ${pageData?.totalPages}` : "0 / 0"}
          </span>  
        </div>
      )}
    </div>
  );
}

export default AlertPage