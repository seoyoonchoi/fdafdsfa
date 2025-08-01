import { signUpResultRequest } from "@/apis/auth/auth";
import Modal from "@/apis/constants/Modal";
import {
  employeeSignUpApprovalRequest,
  employeeSignUpListRequest,
} from "@/apis/employee/Employee";
import { EmployeeSignUpListResponseDto } from "@/dtos/employee/response/Employee-sign-up-list.response.dto";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

function EmployeeSignUpApprovals() {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;
  const [employeeList, setEmployeeList] = useState<
    EmployeeSignUpListResponseDto[]
  >([]);
  const [employee, setEmployee] = useState({ employeeId: 0, approvalId: 0 });
  const [message, setMessage] = useState("");
  const [deniedErrorMessage, setDeniedErrorMessage] = useState("");
  const [modalStatus, setModalStatus] = useState(false);
  const [deniedReason, setDeniedReason] = useState("");
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const onInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setDeniedReason(value);
  };

  const fetchEmployeeSignUpList = async (page: number) => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }
    try {
      const response = await employeeSignUpListRequest(
        { page: page, size: PAGE_SIZE },
        token
      );
      const { code, message, data } = response;

      if (code === "SU" && data) {
        if ("content" in data) {
          setEmployeeList(data.content);
          setTotalPage(data.totalPages);
          setCurrentPage(data.currentPage);
          setMessage("");
        } else {
          setEmployeeList([]);
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

  useEffect(() => {
    fetchEmployeeSignUpList(0);
  }, [token]);

  const onOpenModalClick = async (employee: EmployeeSignUpListResponseDto) => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    setEmployee({
      employeeId: employee.employeeId,
      approvalId: employee.approvalId,
    });

    setModalStatus(true);
  };

  const onApprovedClick = async (employee: EmployeeSignUpListResponseDto) => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    const response = await employeeSignUpApprovalRequest(
      employee.employeeId,
      { isApproved: "APPROVED", deniedReason: "" },
      token
    );

    const responseBody = await signUpResultRequest(employee.approvalId);

    const { code, message } = response;

    if (code === "SU" && responseBody.code === "SU") {
      alert(message + "\n이메일 전송 성공");
      fetchEmployeeSignUpList(0);
    } else {
      alert(message + "\n이메일 전송 실패: " + responseBody.message);
      fetchEmployeeSignUpList(0);
    }
  };

  const onSubmitClick = async () => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    if (!deniedReason) {
      setDeniedErrorMessage("거절 사유를 선택하세요.");
      return;
    }

    const response = await employeeSignUpApprovalRequest(
      employee.employeeId,
      { isApproved: "DENIED", deniedReason: deniedReason },
      token
    );

    const responseBody = await signUpResultRequest(employee.approvalId);

    const { code, message } = response;

    if (code === "SU" && responseBody.code === "SU") {
      alert(message + "\n이메일 전송 성공");
      fetchEmployeeSignUpList(0);
    } else {
      alert(message + "\n이메일 전송 실패: " + responseBody.message);
      fetchEmployeeSignUpList(0);
    }

    setModalStatus(false);
  };

  const modalContent: React.ReactNode = (
    <>
      <div>
        <h1>거절 사유</h1>
        <select value={deniedReason} onChange={onInputChange}>
          <option value="">거절 사유 선택</option>
          <option value="INVALID_EMPLOYEE_INFO">사원 정보 불일치</option>
          <option value="ACCOUNT_ALREADY_EXISTS">
            이미 계정이 발급된 사원
          </option>
          <option value="PENDING_RESIGNATION">퇴사 예정자</option>
        </select>
        {deniedErrorMessage && <p>{deniedErrorMessage}</p>}
        <button onClick={onSubmitClick}>확인</button>
      </div>
    </>
  );

  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPage) return;

    fetchEmployeeSignUpList(page);
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
      <h2>로그인 승인</h2>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <th></th>
            <th>사원 번호</th>
            <th>사원 명</th>
            <th>지점 명</th>
            <th>이메일</th>
            <th>전화 번호</th>
            <th>회원가입 날짜</th>
            <th>승인 상태</th>
            <th>승인</th>
            <th>거절</th>
          </tr>
        </thead>
        <tbody>
          {employeeList.map((employee, index) => (
            <tr key={employee.approvalId}>
              <td>{currentPage * PAGE_SIZE + index + 1}</td>
              <td>{employee.employeeNumber}</td>
              <td>{employee.employeeName}</td>
              <td>{employee.branchName}</td>
              <td>{employee.email}</td>
              <td>{employee.phoneNumber}</td>
              <td>{employee.appliedAt}</td>
              <td>{employee.isApproved === "PENDING" ? "대기 중" : "오류"}</td>
              <td>
                <button onClick={() => onApprovedClick(employee)}>승인</button>
              </td>
              <td>
                <button onClick={() => onOpenModalClick(employee)}>거절</button>
              </td>
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
      {modalStatus && (
        <Modal
          isOpen={modalStatus}
          onClose={() => setModalStatus(false)}
          children={modalContent}
        />
      )}
    </div>
  );
}

export default EmployeeSignUpApprovals;
