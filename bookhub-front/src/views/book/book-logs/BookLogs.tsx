import { getBookLogs } from '@/apis/book/book';
import { BookLogResponseDto } from '@/dtos/book/response/BookLog.response.dto';
import { PageResponseDto } from '@/dtos/PageResponseDto';
import { useState } from 'react'
import { useCookies } from 'react-cookie'

function BookLogs() {
  const [cookies] = useCookies(["accessToken"]);
  const [isbn, setIsbn] = useState("");
  const [pageData, setPageData] = useState<PageResponseDto<BookLogResponseDto> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const pagesPerGroup = 5;

  const handleSearch = async () => {
    if(!isbn.trim()) {
      alert("ISBN을 입력해 주세요.");
      return;
    }
    fetchLogs(0);
  };

  const fetchLogs = async (page: number) => {
    try {
      const res = await getBookLogs(isbn, cookies.accessToken, page, itemsPerPage);
      if(res.code === "SU" && res.data) {
        setPageData(res.data);
        setCurrentPage(page);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      alert("도서 로그 조회 실패");
      console.error(error);
    }
  };

  const goToPage = (page: number) => {
    if (pageData && page >= 0 && page < pageData.totalPages) {
      fetchLogs(page);
    }
  };

  const currentGroup = Math.floor(currentPage / pagesPerGroup);
  const startPage = currentGroup & pagesPerGroup;
  const endPage = Math.min(startPage + pagesPerGroup, pageData?.totalPages ?? 0);

  return (
    <div>
      <div className="">
        <h2>도서 로그 조회</h2>
        <input
          className=""
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          placeholder="ISBN을 입력하세요"
          />
        <button
          type="button"
          className=""
          onClick={handleSearch}
        >검색</button>
      </div>

      <div className="">
        <table>
          <thead>
            <tr>
              <th>도서명</th>
              <th>로그유형</th>
              <th>이전 가격</th>
              <th>이전 할인율</th>
              <th>담당자</th>
              <th>변경일</th>
            </tr>
          </thead>
          <tbody>
            {pageData && pageData.content.length > 0 ? (
              pageData.content.map((log) => (
                <tr key={log.bookLogId}>
                  <td>{log.bookTitle}</td>
                  <td>{log.bookLogType}</td>
                  <td>{log.previousPrice ?? "-"}</td>
                  <td>{log.previousDiscountRate ?? "-"}</td>
                  <td>{log.employeeName}</td>
                  <td>{log.changedAt ? new Date(log.changedAt).toLocaleString() : "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>조회된 로그가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageData && pageData.totalPages > 0 && (
        <div>
          <button onClick={() => goToPage(startPage - pagesPerGroup)} disabled={startPage === 0}>{"<"}</button>
          {Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map((i) => (
            <button
              key={i}
              className={`pageBtn${i === currentPage ? " current" : ""}`} onClick={() => goToPage(i)}>{i+1}</button>
          ))}
          <button
            onClick={() => goToPage(startPage + pagesPerGroup)} disabled={endPage >= (pageData?.totalPages ?? 0)}>{">"}</button>
          <span>{`${(pageData?.currentPage ?? 0) + 1} / ${pageData?.totalPages ?? 0}`}</span>
        </div>
      )}
    </div>
  );
}

export default BookLogs