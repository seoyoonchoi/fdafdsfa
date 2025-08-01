
import Modal from "@/apis/constants/Modal";
import { PurchaseOrderStatus } from "@/apis/enums/PurchaseOrderStatus";
import {
  deletePurchaseOrder,
  getAllPurchaseOrderByCriteria,
  updatePurchaseOrder,
} from "@/apis/purchaseOrder/purchaseOrder";
import { PurchaseOrderResponseDto } from "@/dtos/purchaseOrder/PurchaseOrder.response.dto";
;
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import CreatePurchaseOrder from "./CreatePurchaseOrder";

function ElsePurchaseOrder() {
  const [searchForm, setSearchForm] = useState<{
    employeeName: string;
    bookIsbn: string;
    approvalStatus: PurchaseOrderStatus | null;
  }>({
    employeeName: "",
    bookIsbn: "",
    approvalStatus: null,
  });

  const [updateForm, setUpdateForm] = useState({
    isbn: "",
    purchaseOrderAmount: 0,
  });

  const [cookies] = useCookies(["accessToken"]);
  const [message, setMessage] = useState("");
  const [purchaseOrderId, setPurchaseOrderId] = useState<number>(0);
  const [purchaseOrders, setPurchaseOrders] = useState<
    PurchaseOrderResponseDto[]
  >([]);
  const [modalStatus, setModalStatus] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchForm({ ...searchForm, [name]: value });
  };

  const onUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateForm({ ...updateForm, [name]: value });
  };

  //* 조회 조건으로 조회(발주 담당자, 책 제목, 승인 여부) -- 조건 없을 시 전체 조회
  const onGetPurchaseOrderByCriteria = async () => {
    setPurchaseOrders([]);
    const { employeeName, bookIsbn, approvalStatus } = searchForm;
    const token = cookies.accessToken;

    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    try {
      const response = await getAllPurchaseOrderByCriteria(
        employeeName,
        bookIsbn,
        approvalStatus,
        token
      );
      const { code, message, data } = response;

      if (code != "SU") {
        setMessage(message);
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        setPurchaseOrders(data);
        setMessage("");
        setCurrentPage(0);
      } else {
        setMessage("올바른 검색 조건을 입력해주세요.");
      }
    } catch (error) {
      console.error(error);
      alert("조회 중 오류가 발생했습니다.");
    }
  };

  //* 수정 모달창
  const openUpdateModal = (purchaseOrder: PurchaseOrderResponseDto) => {
    if (
      purchaseOrder.purchaseOrderStatus === "APPROVED" ||
      purchaseOrder.purchaseOrderStatus === "DENIED"
    ) {
      alert("이미 승인(또는 승인거절)된 요청입니다.");
      return;
    }
    setPurchaseOrderId(purchaseOrder.purchaseOrderId);
    setUpdateForm({
      isbn: purchaseOrder.isbn,
      purchaseOrderAmount: purchaseOrder.purchaseOrderAmount,
    });
    setModalStatus(true);
  };

  // * 수정 모달창 내용
  const modalContent: React.ReactNode = (
    <div>
      <h3>발주량 수정 모달</h3>
      <h5>ISBN: {updateForm.isbn}</h5>
      <input
        type="text"
        name="purchaseOrderAmount"
        value={updateForm.purchaseOrderAmount}
        onChange={onUpdateInputChange}
        placeholder="수정할 발주량을 입력하세요"
      />
      <button onClick={() => onUpdatePurchaseOrderAmountClick(purchaseOrderId)}>
        수정
      </button>
    </div>
  );

  //* 수정 (발주량만 수정 가능하도록)
  const onUpdatePurchaseOrderAmountClick = async (purchaseOrderId: number) => {
    const dto = {
      isbn: updateForm.isbn,
      purchaseOrderAmount: updateForm.purchaseOrderAmount,
    };
    const token = cookies.accessToken;

    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    try {
      const response = await updatePurchaseOrder(purchaseOrderId, dto, token);
      const { code, message } = response;

      if (code != "SU") {
        setMessage(message);
        return;
      }

      // 수정 후 리스트 업데이트
      const updatedPurchaseOrders = purchaseOrders.map((order) =>
        order.purchaseOrderId === purchaseOrderId
          ? {
              ...order,
              purchaseOrderAmount: updateForm.purchaseOrderAmount,
              purchaseOrderPrice:
                order.bookPrice * updateForm.purchaseOrderAmount,
            }
          : order
      );
      setPurchaseOrders(updatedPurchaseOrders);

      alert("수정되었습니다.");
      setModalStatus(false);
    } catch (error) {
      console.error(error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  //* 삭제
  const onDeletePurchaseOrderClick = async (
    purchaseOrder: PurchaseOrderResponseDto,
    purchaseOrderId: number
  ) => {
    if (
      purchaseOrder.purchaseOrderStatus === "APPROVED" ||
      purchaseOrder.purchaseOrderStatus === "DENIED"
    ) {
      alert("이미 승인(또는 승인거절)된 요청입니다.");
      return;
    }

    const token = cookies.accessToken;

    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    try {
      const response = await deletePurchaseOrder(purchaseOrderId, token);
      const { code, message } = response;

      if (code != "SU") {
        setMessage(message);
        return;
      }

      const updatedPurchaseOrders = purchaseOrders.filter(
        (order) => order.purchaseOrderId !== purchaseOrderId
      );
      setPurchaseOrders(updatedPurchaseOrders);

      alert("삭제되었습니다.");
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const totalPages = Math.ceil(purchaseOrders.length / itemsPerPage);

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

  const pagedPurchaseOrders = purchaseOrders.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // *노출 리스트
  const responsePurchaseOrderList = pagedPurchaseOrders.map(
    (purchaseOrder, index) => {
      return (
        <tr key={index}>
          <td>{purchaseOrder.branchName}</td>
          <td>{purchaseOrder.branchLocation}</td>
          <td>{purchaseOrder.employeeName}</td>
          <td>{purchaseOrder.isbn}</td>
          <td>{purchaseOrder.bookTitle}</td>
          <td>{purchaseOrder.purchaseOrderAmount}</td>
          <td>
            {new Date(purchaseOrder.purchaseOrderDateAt).toLocaleString(
              "ko-KR"
            )}
          </td>
          <td>
            {purchaseOrder.purchaseOrderStatus == PurchaseOrderStatus.REQUESTED
              ? "요청중"
              : purchaseOrder.purchaseOrderStatus ===
                PurchaseOrderStatus.APPROVED
              ? "승인"
              : "거부"}
          </td>
          <td>
            <button
              onClick={() => openUpdateModal(purchaseOrder)}
              
            >
              수정
            </button>
            <button
              onClick={() =>
                onDeletePurchaseOrderClick(
                  purchaseOrder,
                  purchaseOrder.purchaseOrderId
                )
              }
         
            >
              삭제
            </button>
          </td>
        </tr>
      );
    }
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <CreatePurchaseOrder />
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            type="text"
            name="employeeName"
            value={searchForm.employeeName}
            placeholder="발주담당자"
            onInput={onSearchInputChange}
            style={{ border: "1px solid #ccc", textAlign: "center" }}
          />
          <input
            type="text"
            name="bookIsbn"
            value={searchForm.bookIsbn}
            placeholder="ISBN"
            onInput={onSearchInputChange}
            style={{ border: "1px solid #ccc", textAlign: "center" }}
          />
          <select
            name="approvalStatus"
            value={
              searchForm.approvalStatus == null
                ? ""
                : String(searchForm.approvalStatus)
            }
            onChange={(e) =>
              setSearchForm({
                ...searchForm,
                approvalStatus:
                  e.target.value == ""
                    ? null
                    : e.target.value === "REQUESTED"
                    ? PurchaseOrderStatus.REQUESTED
                    : e.target.value === "APPROVED"
                    ? PurchaseOrderStatus.APPROVED
                    : PurchaseOrderStatus.REJECTED,
              })
            }
          >
            <option value="">전체</option>
            <option value="REQUESTED">요청중</option>
            <option value="APPROVED">승인</option>
            <option value="REJECTED">승인 거부</option>
          </select>
          <button
            onClick={onGetPurchaseOrderByCriteria}
            style={{ border: "1px solid #ccc", width: "50px" }}
          >
            검색
          </button>
        </div>
      </div>
      {purchaseOrders && (
        <table>
          <thead>
            <tr>
              <th>지점명</th>
              <th>지점 주소</th>
              <th>발주 담당 사원</th>
              <th>ISBN</th>
              <th>책 제목</th>
              <th>발주 수량</th>
              <th>발주 일자</th>
              <th>승인 상태</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>{responsePurchaseOrderList}</tbody>
        </table>
      )}
      {modalStatus && (
        <Modal
          isOpen={modalStatus}
          onClose={() => {
            setModalStatus(false);
            setMessage("");
          }}
          children={modalContent}
        />
      )}
      {message && <p>{message}</p>}
      {/* 페이지네이션 */}
      {purchaseOrders.length > 0 && (
        <div className="footer">
          <button
            className="pageBtn"
            onClick={goPrev}
            disabled={currentPage === 0}
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i).map((i) => (
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
            disabled={currentPage >= totalPages - 1}
          >
            {">"}
          </button>
          <span className="pageText">
            {totalPages > 0 ? `${currentPage + 1} / ${totalPages}` : "0 / 0"}
          </span>
        </div>
      )}
    </div>
  );
}

export default ElsePurchaseOrder;
