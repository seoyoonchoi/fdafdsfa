import { employeeExitLogsSearchRequest } from "@/apis/employee/EmployeeExitLogs";
import { EmployeeExitLogsSearchParams } from "@/dtos/employee/request/Employee-exit-logs-search-params";
import { EmployeeExitLogsResponseDto } from "@/dtos/employee/response/Employee-exit-logs.response.dto";
import { useState } from "react";
import { useCookies } from "react-cookie";

const exitReasonMap: Record<string, string> = {
  RETIREMENT: "정년 퇴직",
  VOLUNTEER: "자진 퇴사",
  FORCED: "권고 사직",
  TERMINATED: "해고",
};

function EmployeeExitLog() {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchForm, setSearchForm] = useState<EmployeeExitLogsSearchParams>({
    page: 0,
    size: PAGE_SIZE,
    employeeName: "",
    authorizerName: "",
    exitReason: "",
    startUpdatedAt: "",
    endUpdatedAt: "",
  });
  const [employeeExitLogs, setEmployeeExitLogs] = useState<
    EmployeeExitLogsResponseDto[]
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
      const response = await employeeExitLogsSearchRequest(requestBody, token);

      const { code, message, data } = response;

      if (code === "SU" && data) {
        if ("content" in data) {
          setEmployeeExitLogs(data.content);
          setTotalPage(data.totalPages);
          setCurrentPage(data.currentPage);
          setMessage("");
        } else {
          setEmployeeExitLogs([]);
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
      exitReason: "",
      startUpdatedAt: "",
      endUpdatedAt: "",
    });
    setEmployeeExitLogs([]);
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
        <h2>퇴사자 로그 조회</h2>
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
            name="exitReason"
            value={searchForm.exitReason}
            onChange={onInputChange}
          >
            <option value="">퇴사 사유를 선택하세요.</option>
            <option value="RETIREMENT">정년 퇴직</option>
            <option value="VOLUNTEER">자진 퇴사</option>
            <option value="FORCED">권고 사직</option>
            <option value="TERMINATED">해고</option>
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
            placeholder="종료 일자"
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
            <td>사원 번호</td>
            <td>사원 명</td>
            <td>지점 명</td>
            <td>직급 명</td>
            <td>상태</td>
            <td>퇴사 사유</td>
            <td>권한자 사원 번호</td>
            <td>권한자 명</td>
            <td>퇴사 일자</td>
          </tr>
        </thead>
        <tbody>
          {employeeExitLogs.map((employeeExitLog, index) => (
            <tr key={employeeExitLog.exitId}>
              <td>{currentPage * PAGE_SIZE + index + 1}</td>
              <td>{employeeExitLog.employeeNumber}</td>
              <td>{employeeExitLog.employeeName}</td>
              <td>{employeeExitLog.branchName}</td>
              <td>{employeeExitLog.positionName}</td>
              <td>{employeeExitLog.status === "EXITED" ? "퇴사" : "재직"}</td>
              <td>
                {employeeExitLog.exitReason
                  ? exitReasonMap[employeeExitLog.exitReason] ||
                    employeeExitLog.exitReason
                  : "-"}
              </td>
              <td>{employeeExitLog.authorizerNumber}</td>
              <td>{employeeExitLog.authorizerName}</td>
              <td>{employeeExitLog.updatedAt}</td>
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

export default EmployeeExitLog;
