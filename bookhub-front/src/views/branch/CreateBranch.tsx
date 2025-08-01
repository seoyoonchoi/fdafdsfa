import {
  branchCreateRequest,
  branchDetailRequest,
  branchSearchRequest,
  branchUpdateRequest,
} from "@/apis/branch/branch";
import Modal from "@/apis/constants/Modal";
import { BranchCreateRequestDto } from "@/dtos/branch/request/Branch-create.request.dto";
import { BranchSearchParams } from "@/dtos/branch/request/Branch-search-params";
import { BranchDetailResponseDto } from "@/dtos/branch/response/Branch-detail.response.dto";
import { BranchSearchResponseDto } from "@/dtos/branch/response/Branch-search.response.dto";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

function CreateBranch() {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;
  const PAGE_SIZE = 10;
  const [searchForm, setSearchForm] = useState<BranchSearchParams>({
    page: 0,
    size: PAGE_SIZE,
    branchLocation: "",
  });
  const [message, setMessage] = useState("");
  const [createErrorMessage, setCreateErrorMessage] = useState("");
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [branchList, setBranchList] = useState<BranchSearchResponseDto[]>([]);
  const [branchDetail, setBranchDetail] = useState<BranchDetailResponseDto>({
    branchId: 0,
    branchName: "",
    branchLocation: "",
  });
  const [createBranch, setCreateBranch] = useState<BranchCreateRequestDto>({
    branchName: "",
    branchLocation: "",
  });

  const [modalStatus, setModalStatus] = useState(false);
  const [modalUpdateStatus, setModalUpdateStatus] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchForm({ ...searchForm, [name]: value });
  };

  const onCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateBranch({ ...createBranch, [name]: value });
  };

  const onUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBranchDetail({ ...branchDetail, [name]: value });
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

  const onOpenCreateModal = () => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    setCreateBranch({
      branchName: "",
      branchLocation: "",
    });

    setModalStatus(true);
  };

  const onCreateClick = async () => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    const response = await branchCreateRequest(createBranch, token);
    const { code, message } = response;

    if (code === "SU") {
      alert("지점이 등록되었습니다.");
    } else {
      setCreateErrorMessage(message);
      return;
    }

    setModalStatus(false);
    onSearchClick(0);
  };

  const modalContent = (
    <>
      <div>
        <h1>지점 등록</h1>
        <input
          type="text"
          name="branchName"
          value={createBranch.branchName}
          placeholder="지점 명"
          onChange={onCreateInputChange}
        />
        <input
          type="text"
          name="branchLocation"
          value={createBranch.branchLocation}
          placeholder="지점 위치"
          onChange={onCreateInputChange}
        />
        {createErrorMessage && <p>{createErrorMessage}</p>}
        <button onClick={onCreateClick}>등록</button>
      </div>
    </>
  );

  const onOpenUpdateModal = async (branch: BranchSearchResponseDto) => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    const response = await branchDetailRequest(branch.branchId, token);
    const { code, message, data } = response;

    if (code === "SU" && data) {
      setBranchDetail(data);
    } else {
      alert(message);
      return;
    }
    setModalUpdateStatus(true);
  };

  const modalUpdateContent = (
    <>
      <div>
        <h1>지점 수정</h1>
        <input
          type="text"
          name="branchName"
          value={branchDetail.branchName}
          placeholder="지점 명"
          onChange={onUpdateInputChange}
        />
        <input
          type="text"
          name="branchLocation"
          value={branchDetail.branchLocation}
          placeholder="지점 위치"
          onChange={onUpdateInputChange}
        />
        {updateErrorMessage && <p>{updateErrorMessage}</p>}
        <button onClick={() => onUpdateClick(branchDetail.branchId)}>
          수정
        </button>
      </div>
    </>
  );

  const onUpdateClick = async (branchId: number) => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    const response = await branchUpdateRequest(branchId, branchDetail, token);
    const { code, message } = response;

    if (code === "SU") {
      alert("지점이 수정되었습니다.");
    } else {
      setUpdateErrorMessage(message);
      return;
    }

    setModalUpdateStatus(false);
    onSearchClick(0);
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
      <h2>지점 괸리</h2>
      <div>
        <input
          type="text"
          name="branchLocation"
          value={searchForm.branchLocation}
          placeholder="지점 주소"
          onChange={onInputChange}
        />
        <div className="search-button">
          <button onClick={() => onSearchClick(0)}>검색</button>
          <button onClick={onResetClick}>최기화</button>
          <button onClick={onOpenCreateModal}>등록</button>
        </div>
        {message && <p>{message}</p>}
        <table>
          <thead>
            <tr>
              <th></th>
              <th>지점 명</th>
              <th>지점 주소</th>
              <th>등록 일자</th>
              <th>지점 수정</th>
            </tr>
          </thead>
          <tbody>
            {branchList.map((branch, index) => (
              <tr key={branch.branchId}>
                <td>{currentPage * PAGE_SIZE + index + 1}</td>
                <td>{branch.branchName}</td>
                <td>{branch.branchLocation}</td>
                <td>{branch.createdAt}</td>
                <td>
                  <button
                    onClick={() => onOpenUpdateModal(branch)}
                    className="approval-button"
                  >
                    수정
                  </button>
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
      </div>
      {modalStatus && (
        <Modal
          isOpen={modalStatus}
          onClose={() => setModalStatus(false)}
          children={modalContent}
        />
      )}
      {modalUpdateStatus && (
        <Modal
          isOpen={modalUpdateStatus}
          onClose={() => setModalUpdateStatus(false)}
          children={modalUpdateContent}
        />
      )}
    </div>
  );
}

export default CreateBranch;
