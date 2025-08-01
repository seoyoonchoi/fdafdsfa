import { getMonthlyBestSellers, getWeeklyBestSellers, getYearlyBestSellers } from '@/apis/statistics/salesQuantityStatistics/SalesQuantityStatistics';
import { BestSellerResponseDto } from '@/dtos/statistics/salesQuantityStatistics/response/BestSeller.response.dto';
import { useState } from 'react'
import { useCookies } from 'react-cookie';

function BestSellerByPeriod() {
  const [bestSeller, setBestSeller] = useState<BestSellerResponseDto[]>([]);
  const [cookies] = useCookies(["accessToken"]);
  const [bestSellerTitle, setBestSellerTitle] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  
  const onWeeklyBestSellers = async () => {
    const token = cookies.accessToken;

    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }
    const response = await getWeeklyBestSellers(token);
    const { code, message, data } = response;

    if (code != "SU") {
      alert(`${message}`);
        return;
    }

    if (Array.isArray(data)) {
      setBestSeller(data);
    }
  };
  const onMonthlyBestSellers = async () => {
    const token = cookies.accessToken;

    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    const response = await getMonthlyBestSellers(token);
    const { code, message, data } = response;

    if (!code) {
      alert(`${message}`);
      return;
    }

    if (Array.isArray(data)) {
      setBestSeller(data);
    }
  };

  const onYearlyBestSellers = async () => {
    const token = cookies.accessToken;

    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
  }

  const response = await getYearlyBestSellers(token);
  const { code, message, data } = response;

  if (!code) {
    alert(`${message}`);
    return;
  }

  if (Array.isArray(data)) {
    setBestSeller(data);
    setMessage("");
  } else {
    setMessage("해당 데이터가 존재하지 않습니다.");
  }
};

  const totalPages = Math.ceil(bestSeller.length / itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const goPrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const pagedBestSeller = bestSeller.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const bestSellerList = pagedBestSeller.map((book, index) => {
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>
          {book.coverUrl ? (
            <img src={`http://localhost:8080${encodeURI(book.coverUrl)}`}
            alt="cover" 
            width={90}
            height={120}/>
          ) : (
            "없음"
          )}
        </td>
        <td>{book.isbn}</td>
        <td>{book.bookTitle}</td>
        <td>{book.authorName}</td>
        <td>{book.publisherName}</td>
        <td>{book.categoryName}</td>
        <td>{book.totalSales}</td>
      </tr>
    );
  });

  return (
    <div>
      <h2>기간별 베스트셀러 순위</h2>
      <div>
          <div>
            <button
              onClick={() => {
                onWeeklyBestSellers(), setBestSellerTitle("주간 베스트셀러");
              }}>
                주간 베스트셀러
              </button>
              <button
                onClick={() => {
                  onMonthlyBestSellers(), setBestSellerTitle("월간 베스트셀러");
                }}>
                  월간 베스트셀러
                </button>
                <button
                  onClick={() => {
                    onYearlyBestSellers(), setBestSellerTitle("연간 베스트셀러");
                  }}>
                    연간 베스트셀러
                  </button>
          </div>
          <div>
            <h3>{bestSellerTitle}</h3>
          </div>
        </div>
        {bestSeller && (
          <table>
            <thead>
              <tr>
                <th>순위</th>
                <th>표지</th>
                <th>ISBN</th>
                <th>책 제목</th>
                <th>저자</th>
                <th>출판사</th>
                <th>카테고리</th>
                <th>판매량</th>
              </tr>
            </thead>
            <tbody>{bestSellerList}</tbody>
          </table>
        )}
        {message}

        {bestSeller.length > 0 && (
          <div>
            <button
              onClick={goPrev}
              disabled={currentPage === 0}>
                {"<"}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i).map((i) => (
                <button
                  key={i}
                  className={`pageBtn${i === currentPage ? "current" : ""}`}
                  onClick={() => goToPage(i)}>
                  {i + 1}
                  </button>
              ))}
              <button
                onClick={goNext}
                disabled={currentPage >= totalPages - 1}>
                  {">"}
                </button>
                <span>
                  {totalPages > 0 ? `${currentPage + 1} / ${totalPages} ` : "0 / 0"}
                </span>
          </div>
        )}
    </div>
  );
}

export default BestSellerByPeriod