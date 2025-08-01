import { GET_ALL_BRANCH_URL } from '@/apis/branch/branchUrl';
import { getAdminReceptionApproval } from '@/apis/reception/reception';
import { PageResponseDto } from '@/dtos/PageResponseDto';
import { ReceptionListResponseDto } from '@/dtos/reception/response/Reception.response.dto';
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';

type Branch = {
  branchId: number;
  branchName: string;
};

function AdminReceptionList() {
  const [cookies] = useCookies(["accessToken"]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchName, setBranchName] = useState("");
  const [bookIsbn, setBookIsbn] = useState("");
  const [pageData, setPageData] = useState<PageResponseDto<ReceptionListResponseDto> | null>(null);
  const itemsPerPage = 10;

  const fetchLogs = async (page: number = 0) => {
    const token = cookies.accessToken;
    if (!token) return alert("토큰 없음");
    try {
      const res = await getAdminReceptionApproval(
        token,
        branchName.trim() === "" ? undefined : branchName,
        bookIsbn.trim() === "" ? undefined : bookIsbn,
        page,
        itemsPerPage
      );
      if (res.code === "SU" && res.data) {
        setPageData(res.data);
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error(error);
      alert("조회 실패");
    }
  };

  useEffect(() => {
    fetch(`${GET_ALL_BRANCH_URL}?branchLocation`)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.data && data.data.length > 0) setBranches(data.data);
    });
    fetchLogs(0);
  }, []);

  useEffect(() => {
    fetchLogs(0);
  }, [branchName, bookIsbn]);

  const fetchAllLogs = () => {
    setBranchName("");
    setBookIsbn("");
    fetchLogs(0);
  };

  const goToPage = (page: number) => {
    if (!pageData) return;
    if (page >= 0 && page < pageData.totalPages) fetchLogs(page);
  };

  return (
    <div>
      <h2>관리자 수령 확인 로그 조회</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px"}}>
        <select value={branchName} onChange={(e) => setBranchName(e.target.value)}>
          <option value="">전체 지점</option>
          {branches.map((branch) => (
            <option key={branch.branchId} value={branch.branchName}>
              {branch.branchName}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="ISBN 검색"
          value={bookIsbn}
          onChange={(e) => setBookIsbn(e.target.value)} />
        <button onClick={() => fetchLogs(0)}>조회</button>
        <button onClick={fetchAllLogs}>전체</button>
      </div>
      {!pageData || pageData.content.length === 0 ? (
        <p>조회된 로그가 없습니다.</p>
      ) : (
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
            {pageData.content.map((item, index) => (
              <tr key={item.bookReceptionApprovalId ?? index}>
                <td>{item.branchName}</td>
                <td>{item.bookTitle}</td>
                <td>{item.bookIsbn}</td>
                <td>{item.purchaseOrderAmount}</td>
                <td>
                  {item.receptionDateAt
                    ? new Date(item.receptionDateAt).toISOString().slice(0, 10)
                    : ""}
                </td>
                <td>{item.receptionEmployeeName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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

export default AdminReceptionList