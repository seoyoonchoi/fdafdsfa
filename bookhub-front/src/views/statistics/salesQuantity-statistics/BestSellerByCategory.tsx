import { getCategoryTree } from '@/apis/category/category';
import { getBestSellersByCategory } from '@/apis/statistics/salesQuantityStatistics/SalesQuantityStatistics';
import { CategoryTreeResponseDto } from '@/dtos/category/response/Category.response.dto';
import { BestSellerResponseDto } from '@/dtos/statistics/salesQuantityStatistics/response/BestSeller.response.dto';
import { tr } from 'date-fns/locale';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';

function BestSellerByCategory() {
  const [bestSeller, setBestSeller] = useState<BestSellerResponseDto[]>([]);
  const [cookies] = useCookies(["accessToken"]);
  const [message, setMessage] = useState("");
  const [topCategory, setTopCategory] = useState<"DOMESTIC" | "FOREIGN">("DOMESTIC");
  const [bottomCategoryId, setBottomCategoryId] = useState("");
  const [categoryList, setCategoryList] = useState<CategoryTreeResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const token = cookies.accessToken;

  useEffect(() => {
    const fetchBottomCategory = async () => {
      const response = await getCategoryTree(topCategory, cookies.accessToken);
      const { code, message, data } = response;
      if (code != "SU") {
        alert(`${message}`);
        return;
      }
      
      if (Array.isArray(data)) {
        setCategoryList(data);
        setBottomCategoryId("");
      } else {
        alert("잘못된 접근입니다.");
      }
    };
    fetchBottomCategory();
  }, [topCategory]);

  useEffect(() => {
    const fetchDataByCategory = async () => {
      if (!token) {
        alert("인증 토큰이 없습니다.");
        return;
      }

      const response = await getBestSellersByCategory(
        Number(bottomCategoryId),
        token
      );
      const { code, message, data } = response;

      if (code != "SU") {
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
    
    fetchDataByCategory();
  }, [bottomCategoryId]);

  const handleTopCategoryChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTopCategory(event.target.value as "DOMESTIC" | "FOREIGN");
  };

  const handleBottomCategoryChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setBottomCategoryId(event.target.value);
  };

  const categoryOption = categoryList.map((category, index) => {
    return (
      <option key={index} value={category.categoryId}>
        {category.categoryName}
      </option>
    );
  });

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
      currentPage & itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );

    const bestSellerList = pagedBestSeller.map((book, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            {book.coverUrl ? (
              <img src={`http://localhost:8080${encodeURI(book.coverUrl)}`} alt="cover"
              width={90}
              height={120}
              />
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
      <h2>카테고리별 베스트셀러 순위</h2>
      <p>국내 / 해외</p>
      <select
        id="topCategory"
        value={topCategory}
        onChange={handleTopCategoryChange}>
          <option value="DOMESTIC">국내 도서</option>
          <option value="FOREIGN">해외 도서</option>
        </select>

        <p>하위 카테고리</p>
        <select
          id="bottomCategory"
          value={bottomCategoryId}
          onChange={handleBottomCategoryChange}>
            <option value="" disabled hidden>
              하위 카테고리를 선택해주세요
            </option>
            {categoryOption}
          </select>

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
                  <th>세부 카테고리</th>
                  <th>판매량</th>
                </tr>
              </thead>
              <tbody>{bestSellerList}</tbody>
            </table>
          )}
          {message}

          {bestSeller.length > 0 && (
            <div className="">
              <button
                className=""
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
                  className=""
                  onClick={goNext}
                  disabled={currentPage >= totalPages - 1}>
                    {">"}
                  </button>
                  <span className="">
                    {totalPages > 0 ? `${currentPage + 1} / ${totalPages}` : "0 / 0"}
                  </span>
            </div>
          )}
    </div>
  )
}

export default BestSellerByCategory