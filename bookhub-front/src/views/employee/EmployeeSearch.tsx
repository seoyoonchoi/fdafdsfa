import { authorityRequest } from "@/apis/authority/authority";
import { branchRequest } from "@/apis/branch/branch";
import Modal from "@/apis/constants/Modal";
import {
  employeeDetailRequeset,
  employeeRequest,
} from "@/apis/employee/Employee";
import { StatusT } from "@/apis/enums/StatusType";
import { positionRequest } from "@/apis/position/position";
import { AuthorityListResponseDto } from "@/dtos/authority/Authority-list.response.dto";
import { BranchSearchResponseDto } from "@/dtos/branch/response/Branch-search.response.dto";
import { EmployeeSearchParams } from "@/dtos/employee/request/Employee-search-params";
import { EmployeeDetailResponseDto } from "@/dtos/employee/response/Employee-detail.response.dto";
import { EmployeeListResponseDto } from "@/dtos/employee/response/Employee-list.response.dto";
import { PositionListResponseDto } from "@/dtos/position/Position-list.response.dto";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

function EmployeeSearch() {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchForm, setSearchForm] = useState<EmployeeSearchParams>({
    page: 0,
    size: PAGE_SIZE,
    name: "",
    branchId: 0,
    positionId: 0,
    authorityId: 0,
    status: "",
  });
  const [employeeList, setEmployeeList] = useState<EmployeeListResponseDto[]>(
    []
  );
  const [message, setMessage] = useState("");
  const [branches, setBranches] = useState<BranchSearchResponseDto[]>([]);
  const [positions, setPositions] = useState<PositionListResponseDto[]>([]);
  const [authorities, setAuthorities] = useState<AuthorityListResponseDto[]>(
    []
  );
  const [modalStatus, setModalStatus] = useState(false);
  const [employee, setEmployee] = useState<EmployeeDetailResponseDto>();

  const fetchBranchSelect = async () => {
    const response = await branchRequest();
    const { code, message, data } = response;

    if (code === "SU" && data) {
      setBranches(data);
    } else {
      setMessage(message);
    }
  };

  const fetchPositionSelect = async () => {
    const response = await positionRequest();
    const { code, message, data } = response;

    if (code === "SU" && data) {
      setPositions(data);
    } else {
      setMessage(message);
    }
  };

  const fetchAuthoritySelect = async () => {
    const response = await authorityRequest();
    const { code, message, data } = response;

    if (code === "SU" && data) {
      setAuthorities(data);
    } else {
      setMessage(message);
    }
  };

  useEffect(() => {
    fetchBranchSelect();
    fetchPositionSelect();
    fetchAuthoritySelect();
  }, []);

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchForm({ ...searchForm, [name]: value });
  };

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchForm({ ...searchForm, [name]: Number(value) });
  };

  const onSearchClick = async (page: number) => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    try {
      const response = await employeeRequest(
        {
          page: page,
          size: PAGE_SIZE,
          name: searchForm.name,
          branchId: searchForm.branchId,
          authorityId: searchForm.authorityId,
          positionId: searchForm.positionId,
          status: searchForm.status,
        },
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

  const onResetClick = () => {
    setSearchForm({
      page: 0,
      size: PAGE_SIZE,
      name: "",
      branchId: 0,
      positionId: 0,
      authorityId: 0,
      status: "",
    });
    setEmployeeList([]);
    setTotalPage(0);
    setMessage("");
    setCurrentPage(0);
  };

  const onOpenModalClick = async (employee: EmployeeListResponseDto) => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    const response = await employeeDetailRequeset(employee.employeeId, token);
    const { code, message, data } = response;

    if (code === "SU") {
      setEmployee(data);
    } else {
      alert(message);
      return;
    }

    setModalStatus(true);
  };

  const modalContent: React.ReactNode = (
    <>
      <div>
        <h1>사원 세부 사항</h1>
        <div>
          <div>
            <div>
              <label>사원 번호</label>
              <span>{employee?.employeeNumber}</span>
            </div>
            <div>
              <label>사원 이름</label>
              <span>{employee?.employeeName}</span>
            </div>
            <div>
              <label>지점 명</label>
              <span>{employee?.branchName}</span>
            </div>
            <div>
              <label>지급 명</label>
              <span>{employee?.positionName}</span>
            </div>
            <div>
              <label>권한 명</label>
              <span>{employee?.authorityName}</span>
            </div>
          </div>
          <div>
            <div>
              <label>이메일</label>
              <span>{employee?.email}</span>
            </div>
            <div>
              <label>전화 번호</label>
              <span>{employee?.phoneNumber}</span>
            </div>
            <div>
              <label>생년월일: </label>
              <span>
                {new Date(employee?.birthDate || "").toLocaleDateString()}
              </span>
            </div>
            <div>
              <label>재직 상태</label>
              <span>{employee?.status === "EXITED" ? "퇴사" : "재직"}</span>
            </div>
            <div>
              <label>입사 일자:</label>
              <span>
                {new Date(employee?.createdAt || "").toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

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
        <h2>사원 정보 조회</h2>
        <div>
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={searchForm.name}
            onChange={onInputChange}
          />

          <select
            name="branchId"
            value={searchForm.branchId}
            onChange={onSelectChange}
          >
            <option value="">지점 선택</option>
            {branches.map((branch) => (
              <option key={branch.branchId} value={branch.branchId}>
                {branch.branchName}
              </option>
            ))}
          </select>

          <select
            name="positionId"
            value={searchForm.positionId}
            onChange={onSelectChange}
          >
            <option value="">직급 선택</option>
            {positions.map((p) => (
              <option key={p.positionId} value={p.positionId}>
                {p.positionName}
              </option>
            ))}
          </select>

          <select
            name="authorityId"
            value={searchForm.authorityId}
            onChange={onSelectChange}
          >
            <option value={""}>권한 선택</option>
            {authorities.map((a) => (
              <option key={a.authorityId} value={a.authorityId}>
                {a.authorityName}
              </option>
            ))}
          </select>

          <select
            name="status"
            value={searchForm.status}
            onChange={onInputChange}
          >
            <option value="">상태 선택</option>
            {StatusT.map((s) => (
              <option key={s} value={s}>
                {s === "EXITED" ? "퇴사" : "재직"}
              </option>
            ))}
          </select>
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
            <th>사번</th>
            <th>이름</th>
            <th>지점</th>
            <th>직급</th>
            <th>권한</th>
            <th>상태</th>
            <th>세부 사항</th>
          </tr>
        </thead>
        <tbody>
          {employeeList.map((emp, index) => (
            <tr key={emp.employeeId}>
              <th>{currentPage * PAGE_SIZE + index + 1}</th>
              <td>{emp.employeeNumber}</td>
              <td>{emp.employeeName}</td>
              <td>{emp.branchName}</td>
              <td>{emp.positionName}</td>
              <td>{emp.authorityName}</td>
              <td>{emp.status === "EXITED" ? "퇴사" : "재직"}</td>
              <td>
                <button onClick={() => onOpenModalClick(emp)}>세부 사항</button>
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

export default EmployeeSearch;
