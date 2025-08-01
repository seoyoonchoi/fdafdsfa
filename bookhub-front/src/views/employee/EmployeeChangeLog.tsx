import { employeeChangeLogsSearchRequest } from "@/apis/employee/EmployeeChangeLogs";
import { EmployeeChangeLogsSearchParams } from "@/dtos/employee/request/Employee-change-logs-search-params";
import { EmployeeChangeLogsResponseDto } from "@/dtos/employee/response/Employee-change-logs.response.dto";
import { useState } from "react";
import { useCookies } from "react-cookie";

const changeTypeMap: Record<string, string> = {
  POSITION_CHANGE: "직급 변경",
  AUTHORITY_CHANGE: "권한 변경",
  BRANCH_CHANGE: "지점 변경",
};

function EmployeeChangeLog() {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchForm, setSearchForm] = useState<EmployeeChangeLogsSearchParams>({
    page: 0,
    size: PAGE_SIZE,
    employeeName: "",
    authorizerName: "",
    changeType: "",
    startUpdatedAt: "",
    endUpdatedAt: "",
  });
  const [employeeChangeLogs, setEmployeeChangeLogs] = useState<
    EmployeeChangeLogsResponseDto[]
  >([]);
  const [message, setMessage] = useState("");

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchForm({ ...searchForm, [name]: value });
  };

  const onSearchClick = async (page: number) => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    try {
      const requestBody = {
        ...searchForm,
        page: page,
      };
      const response = await employeeChangeLogsSearchRequest(
        requestBody,
        token
      );

      const { code, message, data } = response;

      if (code === "SU" && data) {
        if ("content" in data) {
          setEmployeeChangeLogs(data.content);
          setTotalPage(data.totalPages);
          setCurrentPage(data.currentPage);
          setMessage("");
        } else {
          setEmployeeChangeLogs([]);
          setMessage(message);
          setTotalPage(1);
          setCurrentPage(0);
        }
      } else {
        console.error("목록 조회 실패: ", message);
      }
    } catch (error) {
      console.error("목록 조회 예외: ", error);
    }
  };

  const onResetClick = () => {
    setSearchForm({
      page: 0,
      size: PAGE_SIZE,
      employeeName: "",
      authorizerName: "",
      changeType: "",
      startUpdatedAt: "",
      endUpdatedAt: "",
    });
    setEmployeeChangeLogs([]);
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
      <div>
        <h2>회원정보 로그 조회</h2>
        <div>
          <input
            type="text"
            name="employeeName"
            value={searchForm.employeeName}
            placeholder="사원 명"
            onChange={onInputChange}
          />
          <input
            type="text"
            name="authorizerName"
            value={searchForm.authorizerName}
            placeholder="관리자 명"
            onChange={onInputChange}
          />
          <select
            name="changeType"
            value={searchForm.changeType}
            onChange={onInputChange}
          >
            <option value="">변경 종류를 선택하세요</option>
            <option value="POSITION_CHANGE">직급 변경</option>
            <option value="AUTHORITY_CHANGE">권한 변경</option>
            <option value="BRANCH_CHANGE">지점 변경</option>
          </select>
          <input
            type="date"
            name="startUpdatedAt"
            value={searchForm.startUpdatedAt}
            placeholder="시작 일자"
            onChange={onInputChange}
          />
          <span>~</span>
          <input
            type="date"
            name="endUpdatedAt"
            value={searchForm.endUpdatedAt}
            placeholder="마지막 일자"
            onChange={onInputChange}
          />
          <div>
            <button onClick={() => onSearchClick(0)}>검색</button>
            <button onClick={onResetClick}>초기화</button>
          </div>
        </div>
      </div>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <td></td>
            <th>사원 번호</th>
            <th>사원 명</th>
            <th>변경 종류</th>
            <th>이전 직급</th>
            <th>이전 권한</th>
            <th>이전 지점</th>
            <th>관리자 사원 번호</th>
            <th>관리자 명</th>
            <th>수정 일자</th>
          </tr>
        </thead>
        <tbody>
          {employeeChangeLogs.map((employeeChangeLog, index) => (
            <tr key={employeeChangeLog.logId}>
              <td>{currentPage * PAGE_SIZE + index + 1}</td>
              <td>{employeeChangeLog.employeeNumber}</td>
              <td>{employeeChangeLog.employeeName}</td>
              <td>
                {employeeChangeLog.changeType
                  ? changeTypeMap[employeeChangeLog.changeType] ||
                    employeeChangeLog.changeType
                  : "-"}
              </td>
              <td>
                {employeeChangeLog.prePositionName
                  ? employeeChangeLog.prePositionName
                  : "-"}
              </td>
              <td>
                {employeeChangeLog.preAuthorityName
                  ? employeeChangeLog.preAuthorityName
                  : "-"}
              </td>
              <td>
                {employeeChangeLog.preBranchName
                  ? employeeChangeLog.preBranchName
                  : "-"}
              </td>
              <td>{employeeChangeLog.authorizerNumber}</td>
              <td>{employeeChangeLog.authorizerName}</td>
              <td>{employeeChangeLog.updatedAt}</td>
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

export default EmployeeChangeLog;
