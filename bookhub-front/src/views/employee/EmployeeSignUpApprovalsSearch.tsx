import { employeeSignUpApprovalsSearchRequest } from "@/apis/employee/Employee-sign-up-approvals";
import { ApprovalStatusT } from "@/apis/enums/ApprovalType";
import { EmployeeSignUpApprovalsSearchParams } from "@/dtos/employee/request/Employee-sign-up-approvals-search-params";
import { EmployeeSignUpApprovalsResponseDto } from "@/dtos/employee/response/Employee-sign-up-approvals.response.dto";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

const deniedReasonMap: Record<string, string> = {
  INVALID_EMPLOYEE_INFO: "사원 정보 불일치",
  ACCOUNT_ALREADY_EXISTS: "이미 계정이 발급된 사원",
  CONTRACT_EMPLOYEE_RESTRICTED: "계약직/기간제 사용 제한",
  PENDING_RESIGNATION: "퇴사 예정자",
};

function EmployeeSignUpApprovalsSearch() {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchForm, setSearchForm] =
    useState<EmployeeSignUpApprovalsSearchParams>({
      page: 0,
      size: PAGE_SIZE,
      employeeName: "",
      authorizerName: "",
      isApproved: "",
      deniedReason: "",
      startUpdatedAt: "",
      endUpdatedAt: "",
    });
  const [employeeApprovalList, setEmployeeApprovalList] = useState<
    EmployeeSignUpApprovalsResponseDto[]
  >([]);
  const [message, setMessage] = useState("");

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchForm({ ...searchForm, [name]: value});
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
        deniedReason:
          searchForm.deniedReason === "" ? undefined : searchForm.deniedReason,
      };
      const response = await employeeSignUpApprovalsSearchRequest(
        requestBody,
        token
      );

      const { code, message, data } = response;

      if (code === "SU" && data) {
        if ("content" in data) {
          setEmployeeApprovalList(data.content);
          setTotalPage(data.totalPages);
          setCurrentPage(data.currentPage);
          setMessage("");
        } else {
          setEmployeeApprovalList([]);
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
      isApproved: "",
      deniedReason: "",
      startUpdatedAt: "",
      endUpdatedAt: "",
    });
    setEmployeeApprovalList([]);
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
        <h2>회원 가입 승인 로그 조회</h2>
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
            name="isApproved"
            value={searchForm.isApproved}
            onChange={onInputChange}
          >
            <option value="">승인 상태를 선택하세요.</option>
            {ApprovalStatusT.map((approved) => (
              <option key={approved} value={approved}>
                {approved == "APPROVED" ? "승인" : "거절"}
              </option>
            ))}
          </select>
          <select
            name="deniedReason"
            value={searchForm.deniedReason}
            onChange={onInputChange}
          >
            <option value="">거절 사유를 선택하세요.</option>
            <option value="INVALID_EMPLOYEE_INFO">사원 정보 불일치</option>
            <option value="ACCOUNT_ALREADY_EXISTS">
              이미 계정이 발급된 사원
            </option>
            <option value="PENDING_RESIGNATION">퇴사 예정자</option>
          </select>

          <input
            type="date"
            name="startUpdatedAt"
            value={searchForm.startUpdatedAt}
            placeholder="시작 연도"
            onChange={onInputChange}
          />
          <span>~</span>
          <input
            type="date"
            name="endUpdatedAt"
            value={searchForm.endUpdatedAt}
            placeholder="끝 연도"
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
            <th></th>
            <th>사원 번호</th>
            <th>사원 명</th>
            <th>회원 가입 일자</th>
            <th>승인 상태</th>
            <th>거절 사유</th>
            <th>관리자 사원 번호</th>
            <th>관리자 명</th>
            <th>승인/거절 일자</th>
          </tr>
        </thead>
        <tbody>
          {employeeApprovalList.map((employeeApproval, index) => (
            <tr key={employeeApproval.approvalId}>
              <td>{currentPage * PAGE_SIZE + index + 1}</td>
              <td>{employeeApproval.employeeNumber}</td>
              <td>{employeeApproval.employeeName}</td>
              <td>{new Date(employeeApproval.appliedAt).toLocaleString()}</td>
              <td>
                {employeeApproval.isApproved === "APPROVED" ? "승인" : "거절"}
              </td>
              <td>
                {employeeApproval.deniedReason
                  ? deniedReasonMap[employeeApproval.deniedReason] ||
                    employeeApproval.deniedReason
                  : "-"}
              </td>
              <td>{employeeApproval.authorizerNumber}</td>
              <td>{employeeApproval.authorizerName}</td>
              <td> {employeeApproval.updatedAt}</td>
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

export default EmployeeSignUpApprovalsSearch;
