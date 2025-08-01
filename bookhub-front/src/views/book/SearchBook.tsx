import { useState } from "react";
import { searchBook } from "@/apis/book/book";
import { useCookies } from "react-cookie";
import { getPolicyByCategory } from "@/apis/category/category";
import { getPolicyDetail } from "@/apis/policies/PolicyCommon";
import { BookResponseDto } from "@/dtos/book/response/Book.response.dto";
import { PolicyDetailResponseDto } from "@/dtos/policy/Policy.response.dto";

function SearchBook() {
  const [cookies] = useCookies(["accessToken"]);

  const [keyword, setKeyword] = useState("");
  const [books, setBooks] = useState<BookResponseDto[]>([]);

  const [bookPolicyMap, setBookPolicyMap] = useState<Record<number, PolicyDetailResponseDto>>({});
  const [categoryPolicyMap, setCategoryPolicyMap] = useState<Record<number, PolicyDetailResponseDto>>({});

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const handleSearch = async () => {
    const token = cookies.accessToken;
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
    const res = await searchBook(keyword, token);
    if (res.code !== "SU") throw new Error(res.message);

    const fetchedBooks = res.data || [];
    setBooks(fetchedBooks);
    setCurrentPage(0);

    await fetchBookPolicies(fetchedBooks, token);
    await fetchCategoryPolicies(fetchedBooks, token);
    } catch (e) {
      alert("도서 검색 실패");
      console.error(e);
    }
  };

  const fetchBookPolicies = async (books: BookResponseDto[], token: string) => {
  const ids = Array.from(new Set(
    books.map(b => b.policyId).filter((id): id is number => id != null && id > 0)
  ));

  const map: Record<number, PolicyDetailResponseDto> = {};

  await Promise.all(ids.map(async id => {
    try {
      const res = await getPolicyDetail(id, token);
      if (res.code === "SU" && res.data){
        map[id] = res.data;
      }
    } catch (err) {
      console.error(`책 정책 로딩 실패 [id: ${id}]`, err);
    }
  }));
  setBookPolicyMap(map);
};

  const fetchCategoryPolicies = async (books: BookResponseDto[], token: string) => {
  const categoryIds = Array.from(new Set(
    books.map(b => b.categoryId).filter((id): id is number => id != null && id > 0)
  ));

  const map: Record<number, PolicyDetailResponseDto> = {};

  await Promise.all(categoryIds.map(async id => {
    try {
      const res = await getPolicyByCategory(id, token);
      if (res.code === "SU" && res.data){
        map[id] = res.data;
      }
    } catch (err) {
      console.error(`카테고리 정책 로딩 실패 [id: ${id}]`, err);
    }
  }));

  setCategoryPolicyMap(map);
};

  const isPolicyActive = (startDate?: string, endDate?: string) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || start <= now) && (!end || now <= end);
  };

  const calculatePrice = (book: BookResponseDto) => {
    const original = book.bookPrice;
    const bookPolicy = bookPolicyMap[book.policyId];
    const categoryPolicy = categoryPolicyMap[book.categoryId];

    if (bookPolicy && isPolicyActive(bookPolicy.startDate, bookPolicy.endDate)) {
      return Math.floor(original * (1 - bookPolicy.discountPercent / 100));
    }

    if (categoryPolicy && isPolicyActive(categoryPolicy.startDate, categoryPolicy.endDate)) {
      return Math.floor(original * (1 - categoryPolicy.discountPercent / 100));
    }

    return original;
  };

  const totalPages = Math.ceil(books.length / itemsPerPage);
  const pagesPerGroup = 5;
  const currentGroup = Math.floor(currentPage / pagesPerGroup);
  const startPage = currentGroup * pagesPerGroup;
  const endPage = Math.min(startPage + pagesPerGroup, totalPages);

  const goToPage = (page: number) => page >= 0 && page < totalPages && setCurrentPage(page);
  const goPrev = () => currentPage > 0 && setCurrentPage(currentPage - 1);
  const goNext = () => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1);

  const booksToDisplay = books.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div>
      <div className="topBar">
        <h2>도서 통합 검색</h2>
        <input
          className="book-input"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button type="button" className="button" onClick={handleSearch}>
          검색
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>표지</th>
              <th>Isbn</th>
              <th>제목</th>
              <th>저자</th>
              <th>카테고리</th>
              <th>출판사</th>
              <th>가격</th>
              <th>출판일</th>
              <th>페이지 수</th>
              <th>언어</th>
              <th>판매상태</th>
            </tr>
          </thead>
          <tbody>
            {booksToDisplay.map((book) => {
              const originalPrice = book.bookPrice;
              const discountedPrice = calculatePrice(book);
              return (
                <tr key={book.isbn}>
                  <td>
                    {book.coverUrl ? (
                      <img
                        src={`http://localhost:8080${encodeURI(book.coverUrl)}`}
                        alt="cover"
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
                  <td>{book.categoryName}</td>
                  <td>{book.publisherName}</td>
                  <td>
                    {discountedPrice < originalPrice ? (
                      <>
                        <div style={{ textDecoration: "line-through", color: "#999" }}>
                          {originalPrice.toLocaleString()}원
                        </div>
                        <div style={{ color: "red", fontWeight: "bold" }}>
                          {discountedPrice.toLocaleString()}원
                        </div>
                      </>
                    ) : (
                      <span>{originalPrice.toLocaleString()}원</span>
                    )}
                  </td>
                  <td>{new Date(book.publishedDate).toISOString().slice(0, 10)}</td>
                  <td>{book.pageCount}</td>
                  <td>{book.language}</td>
                  <td>{book.bookStatus}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {books.length > 0 && (
        <div className="footer">
          <button className="pageBtn" onClick={goPrev} disabled={currentPage === 0}>
            {"<"}
          </button>
          {Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map((i) => (
            <button
              key={i}
              className={`pageBtn${i === currentPage ? " current" : ""}`}
              onClick={() => goToPage(i)}
            >
              {i + 1}
            </button>
          ))}
          <button className="pageBtn" onClick={goNext} disabled={currentPage >= totalPages - 1}>
            {">"}
          </button>
          <span className="pageText">{`${currentPage + 1} / ${totalPages}`}</span>
        </div>
      )}
    </div>
  );
}

export default SearchBook;
