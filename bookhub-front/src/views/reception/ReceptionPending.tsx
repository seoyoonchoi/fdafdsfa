import { getAllPendingReception, putReception } from '@/apis/reception/reception';
import { PageResponseDto } from '@/dtos/PageResponseDto';
import { ReceptionListResponseDto } from '@/dtos/reception/response/Reception.response.dto';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

function ReceptionPending() {
  const [cookies] = useCookies(["accessToken"]);
  const [pendingList, setPendingList] = useState<PageResponseDto<ReceptionListResponseDto> | null>(null);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async (page = 0) => {
      const token = cookies.accessToken;
      if (!token) {
        alert("인증 토큰이 없습니다.");
        return;
      }
      try {
        const res = await getAllPendingReception(token, page, itemsPerPage);
        if (res.code === "SU" && res.data) {
          setPendingList(res.data);
          setMessage("");
        } else {
          setPendingList(null);
          setMessage(res.message || "데이터를 불러오는 데 실패했습니다.");
        }
      } catch (error) {
        setPendingList(null);
        setMessage("데이터를 불러오는 데 실패했습니다.");
      }
    };
    fetchData();
  }, [cookies]);

  const totalPages = Math.ceil((pendingList?.content.length ?? 0) / itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const onReceptionApprove = async (receptionApprovalId: number) => {
    const token = cookies.accessToken;
    if (!token) {
      alert('인증 토큰이 없습니다.');
      return;
    }
    const response = await putReception(token, receptionApprovalId);
    const { code, message } = response;
    if (code !== "SU") {
      setMessage(message);
      return;
    }
    alert("수령 확인 성공");
    setPendingList(prev =>
      prev? {
        ...prev,
        content: prev.content.filter(
          item => item.bookReceptionApprovalId !== receptionApprovalId
        ),
      }
      : prev
    );
  }

  const receptionsToDisplay = pendingList && pendingList.content
    ? pendingList.content.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
    )
  : [];

  return (
    <div>
      <h2>수령 확인 대기 리스트</h2>
        <div>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>지점</th>
                <th>도서 제목</th>
                <th>ISBN</th>
                <th>수량</th>
                <th>수령 처리</th>
              </tr>
            </thead>
            <tbody>
              {receptionsToDisplay.length > 0 ? (
                receptionsToDisplay.map((item, index) => (
                  <tr key={item.bookReceptionApprovalId}>
                    <td>{currentPage * itemsPerPage + index + 1}</td>
                    <td>{item.branchName}</td>
                    <td>{item.bookTitle}</td>
                    <td>{item.bookIsbn}</td>
                    <td>{item.purchaseOrderAmount}</td>
                    <td>
                      <button onClick={() => onReceptionApprove(item.bookReceptionApprovalId)}>수령</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>{message || "대기 중인 데이터가 없습니다."}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pendingList && pendingList.totalPages > 0 && (
        <div>
          <button
            onClick={() => goToPage(pendingList.currentPage - 1)}
            disabled={pendingList.currentPage === 0}>
            {"<"}
          </button>
          {Array.from({length: pendingList.totalPages}, (_, i) => (
            <button
              key={i}
              className={`pageBtn${i === pendingList.currentPage ? " current" : ""}`}
              onClick={() => goToPage(i)}>
                {i+1}
              </button>
          ))}
          <button
            onClick={() => goToPage(pendingList.currentPage + 1)}
            disabled={pendingList.currentPage + 1 >= pendingList.totalPages}>
              {">"}
          </button>
          <span>
            {pendingList.totalPages > 0 ? `${pendingList.currentPage + 1} / ${pendingList.totalPages}` : "0 / 0"}
          </span>  
        </div>
      )}
    </div>
  )
}

export default ReceptionPending