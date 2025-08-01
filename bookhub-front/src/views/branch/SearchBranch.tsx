import { branchSearchRequest } from "@/apis/branch/branch";
import { BranchSearchParams } from "@/dtos/branch/request/Branch-search-params";
import { BranchSearchResponseDto } from "@/dtos/branch/response/Branch-search.response.dto";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

function SearchBranch() {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;
  const PAGE_SIZE = 10;
  const [searchForm, setSearchForm] = useState<BranchSearchParams>({
    page: 0,
    size: PAGE_SIZE,
    branchLocation: "",
  });
  const [message, setMessage] = useState("");
  const [branchList, setBranchList] = useState<BranchSearchResponseDto[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchForm({ ...searchForm, [name]: value });
  };

  const onSearchClick = async (page: number) => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    try {
      const response = await branchSearchRequest(
        {
          page: page,
          size: PAGE_SIZE,
          branchLocation: searchForm.branchLocation,
        },
        token
      );

      const { code, message, data } = response;

      if (code === "SU" && data) {
        if ("content" in data) {
          setBranchList(data.content);
          setTotalPage(data.totalPages);
          setCurrentPage(data.currentPage);
        } else {
          setBranchList([]);
          setMessage(message);
          setTotalPage(1);
          setCurrentPage(0);
        }
      } else {
        console.error("목록 조회 실패: ", message);
      }
    } catch (err) {
      console.error("목록 조회 예외: ", err);
    }
  };

  const onResetClick = () => {
    setSearchForm({ page: 0, size: PAGE_SIZE, branchLocation: "" });
    setBranchList([]);
    setTotalPage(0);
    setMessage("");
    setCurrentPage(0);
  };

  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPage) return;

    onSearchClick(page);
  };

  const goPrev = () => {
    if (currentPage > 0) goToPage(currentPage - 1);
  };
  const goNext = () => {
    if (currentPage < totalPage - 1) goToPage(currentPage + 1);
  };
  const startPage = Math.floor(currentPage / PAGE_SIZE) * PAGE_SIZE;
  const endPage = Math.min(startPage + PAGE_SIZE, totalPage);

  return (
    <div>
      <h2>지점 조회</h2>
      <div>
        <input
          type="text"
          name="branchLocation"
          value={searchForm.branchLocation}
          placeholder="지점 주소"
          onChange={onInputChange}
        />
        <div>
          <button onClick={() => onSearchClick(0)}>검색</button>
          <button onClick={onResetClick}>초기화</button>
        </div>
      </div>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <th></th>
            <th>지점 명</th>
            <th>지점 주소</th>
            <th>등록 일자</th>
          </tr>
        </thead>
        <tbody>
          {branchList.map((branch, index) => (
            <tr key={branch.branchId}>
              <td>{currentPage * PAGE_SIZE + index + 1}</td>
              <td>{branch.branchName}</td>
              <td>{branch.branchLocation}</td>
              <td>{branch.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="footer">
        <button
          className="pageBtn"
          onClick={goPrev}
          disabled={currentPage === 0}
        >
          {"<"}
        </button>
        {Array.from(
          { length: endPage - startPage },
          (_, i) => startPage + i
        ).map((i) => (
          <button
            key={i}
            className={`pageBtn${i === currentPage ? " current" : ""}`}
            onClick={() => goToPage(i)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="pageBtn"
          onClick={goNext}
          disabled={currentPage >= totalPage - 1}
        >
          {">"}
        </button>
        <span className="pageText">
          {totalPage > 0 ? `${currentPage + 1} / ${totalPage}` : "0 / 0"}
        </span>
      </div>
    </div>
  );
}

export default SearchBranch;
