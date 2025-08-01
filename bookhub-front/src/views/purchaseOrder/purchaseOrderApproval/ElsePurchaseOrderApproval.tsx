import { PurchaseOrderStatus } from "@/apis/enums/PurchaseOrderStatus";
import { getAllPurchaseOrderApproval } from "@/apis/purchaseOrder/purchaseOrderApproval";
import { PurchaseOrderApprovalSearchParams } from "@/dtos/purchaseOrder/PurchaseOrderApprovalSearchParams";
import { PurchaseOrderApprovalResponseDto } from "@/dtos/purchaseOrderApproval/purchaseOrderApproval.response.dto";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

function ElsePurchaseOrderApproval() {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchForm, setSearchForm] =
    useState<PurchaseOrderApprovalSearchParams>({
      page: 0,
      size: PAGE_SIZE,
      employeeName: "",
      isApproved: undefined,
      startUpdatedAt: "",
      endUpdatedAt: "",
    });
  const [purchaseOrderApprovals, setPurchaseOrderApprovals] = useState<
    PurchaseOrderApprovalResponseDto[]
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
      const response = await getAllPurchaseOrderApproval(requestBody, token);

      const { code, message, data } = response;

      if (code === "SU" && data) {
        if ("content" in data) {
          setPurchaseOrderApprovals(data.content);
          setTotalPage(data.totalPages);
          setCurrentPage(data.currentPage);
          setMessage("");
        } else {
          setPurchaseOrderApprovals([]);
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
      isApproved: undefined,
      startUpdatedAt: "",
      endUpdatedAt: "",
    });
    setPurchaseOrderApprovals([]);
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

  const responsePurchaseOrderApprovalList = purchaseOrderApprovals.map(
    (purchaseOrderApproval, index) => {
      return (
        <tr key={index}>
          <td>{purchaseOrderApproval.employeeName}</td>
          <td>{purchaseOrderApproval.isApproved ? "승인" : "승인 거부"}</td>
          <td>{purchaseOrderApproval.approvedDateAt}</td>

          <td></td>
          <td>{purchaseOrderApproval.poDetail.branchName}</td>
          <td>{purchaseOrderApproval.poDetail.employeeName}</td>
          <td>{purchaseOrderApproval.poDetail.isbn}</td>
          <td>{purchaseOrderApproval.poDetail.bookTitle}</td>
          <td>{purchaseOrderApproval.poDetail.purchaseOrderAmount}</td>
          <td>
            {purchaseOrderApproval.poDetail.purchaseOrderStatus ==
            PurchaseOrderStatus.REQUESTED
              ? "요청중"
              : purchaseOrderApproval.poDetail.purchaseOrderStatus ===
                PurchaseOrderStatus.APPROVED
              ? "승인"
              : "거부"}
          </td>
        </tr>
      );
    }
  );

  return (
    <div>
      <div>
        <div>
          <input
            type="text"
            name="employeeName"
            value={searchForm.employeeName}
            placeholder="승인담당자"
            onChange={onInputChange}
          />
          <select
            name="isApproved"
            value={
              searchForm.isApproved == null ? "" : String(searchForm.isApproved)
            }
            onChange={onInputChange}
          >
            <option value="">전체 (승인여부)</option>
            <option value="true">승인</option>
            <option value="false">승인 거부</option>
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

      {purchaseOrderApprovals && (
        <table>
          <thead>
            <tr>
              <th>승인 담당자</th>
              <th>승인 여부</th>
              <th>승인 일자</th>

              <th>[발주서 사항]</th>
              <th>지점명</th>
              <th>발주 담당자</th>
              <th>ISBN</th>
              <th>책 제목</th>
              <th>발주 수량</th>
              <th>승인 상태</th>
            </tr>
          </thead>
          <tbody>{responsePurchaseOrderApprovalList}</tbody>
        </table>
      )}
      {message && <p>{message}</p>}
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

export default ElsePurchaseOrderApproval;