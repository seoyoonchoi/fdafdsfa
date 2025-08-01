import { getAllReceptionApproval } from '@/apis/reception/reception';
import { PageResponseDto } from '@/dtos/PageResponseDto';
import { ReceptionListResponseDto } from '@/dtos/reception/response/Reception.response.dto';
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

function ReceptionConfirm() {
  const [cookies] = useCookies(["accessToken"]);
  const [pageData, setPageData] = useState<PageResponseDto<ReceptionListResponseDto> | null>(null);
  const [dateForm, setDateForm] = useState({startDate: "", endDate: ""});
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const fetchData = async (page = 0) => {
    const token = cookies.accessToken;
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }
    const { startDate, endDate } = dateForm;
    try {
      const res = await getAllReceptionApproval(token, page, itemsPerPage, startDate, endDate);
      if (res && res.code === "SU" && res.data) {
        setPageData(res.data);
      } else {
        setPageData(null);
        setMessage(res?.message || "데이터를 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      setPageData(null);
      setMessage("데이터를 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchData(0);
  }, [cookies]);

  const goToPage = (page: number) => {
    if (!pageData) return;
    if (page >= 0 && page < pageData.totalPages) {
      setCurrentPage(page);
      fetchData(page);
    }
  };

  const handleFilter = () => {
    if (!dateForm.startDate || !dateForm.endDate) {
      alert("시작일과 종료일 모두 선택해주세요");
      return;
    }
    fetchData(0);
  }

  const handleAll = () => {
    setDateForm({startDate: "", endDate: ""});
    fetchData(0);
  };

  return (
    <div>
      <h2>수령 확인 조회</h2>
      <div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px"}}>
          <input
            type="date"
            name="startDate"
            value={dateForm.startDate}
            onChange={(e) =>
              setDateForm({...dateForm, startDate: e.target.value})
            }
            />
          <input
            type="date"
            name="endDate"
            value={dateForm.endDate}
            onChange={(e) => 
              setDateForm({...dateForm, endDate: e.target.value})
            }
          />
          <button onClick={handleFilter}>조회</button>
          <button onClick={handleAll}>전체 조회</button>
        </div>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>지점</th>
              <th>도서 제목</th>
              <th>ISBN</th>
              <th>수량</th>
              <th>수령일</th>
              <th>수령자</th>
            </tr>
          </thead>
          <tbody>
            {pageData && pageData.content.length > 0 ? (
              pageData.content.map((item) => (
                <tr key={item.bookReceptionApprovalId}>
                  <td>{item.branchName}</td>
                  <td>{item.bookTitle}</td>
                  <td>{item.bookIsbn}</td>
                  <td>{item.purchaseOrderAmount}</td>
                  <td>{item.receptionDateAt ? new Date(item.receptionDateAt).toISOString().slice(0, 10) : ""}</td>
                  <td>{item.receptionEmployeeName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>
                  {message || "데이터가 없습니다."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    {pageData && pageData.totalPages > 0 && (
        <div>
          <button
            onClick={() => goToPage(pageData.currentPage - 1)}
            disabled={pageData.currentPage === 0}>
            {"<"}
          </button>
          {Array.from({length: pageData.totalPages}, (_, i) => (
            <button
              key={i}
              className={`pageBtn${i === pageData.currentPage ? " current" : ""}`}
              onClick={() => goToPage(i)}>
                {i+1}
              </button>
          ))}
          <button
            onClick={() => goToPage(pageData.currentPage + 1)}
            disabled={pageData.currentPage + 1 >= pageData.totalPages}>
              {">"}
          </button>
          <span>
            {pageData.totalPages > 0 ? `${pageData.currentPage + 1} / ${pageData.totalPages}` : "0 / 0"}
          </span>  
        </div>
      )}
    </div>  
  )
}

export default ReceptionConfirm