import { PurchaseOrderStatus } from "@/apis/enums/PurchaseOrderStatus";
import { getAllPurchaseOrderRequested, updatePurchaseOrderStatus } from "@/apis/purchaseOrder/purchaseOrderApproval";
import { PurchaseOrderResponseDto } from "@/dtos/purchaseOrder/PurchaseOrder.response.dto";
import { useState } from "react";
import { useCookies } from "react-cookie";

function ApprovePurchaseOrder() {
  const [cookies] = useCookies(["accessToken"]);
  const [message, setMessage] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState<
    PurchaseOrderResponseDto[]
  >([]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  //* 발주 요청서 업데이트
  const onGetAllPurchaseOrdersRequested = async () => {
    const token = cookies.accessToken;

    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    try {
      const response = await getAllPurchaseOrderRequested(token);
      const { code, message, data } = response;

      if (!code) {
        setMessage(message);
        return;
      }

      if (Array.isArray(data) && data?.length > 0) {
        setPurchaseOrders(data);
      } else {
        setMessage("발주 요청건이 존재하지 않습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다. 다시 한 번 시도해주세요.");
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

  //* 리스트
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
              onClick={() =>
                onPurchaseOrderApproveClick(purchaseOrder.purchaseOrderId)
              }
      
            >
              승인
            </button>
            <button
              onClick={() =>
                onPurchaseOrderRejectClick(purchaseOrder.purchaseOrderId)
              }
           
            >
              승인 거부
            </button>
          </td>
        </tr>
      );
    }
  );

  //* 승인 버튼
  const onPurchaseOrderApproveClick = async (purchaseOrderId: number) => {
    const dto = {
      status: PurchaseOrderStatus.APPROVED,
    };
    const token = cookies.accessToken;

    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    try {
      const response = await updatePurchaseOrderStatus(
        purchaseOrderId,
        dto,
        token
      );
      const { code, message } = response;

      if (!code) {
        setMessage(message);
        return;
      }

      alert("승인되었습니다.");
      setPurchaseOrders(purchaseOrders);
      onGetAllPurchaseOrdersRequested();
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    }
  };

  //* 승인 거절 버튼
  const onPurchaseOrderRejectClick = async (purchaseOrderId: number) => {
    const dto = {
      status: PurchaseOrderStatus.REJECTED,
    };
    const token = cookies.accessToken;

    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    try {
      const response = await updatePurchaseOrderStatus(
        purchaseOrderId,
        dto,
        token
      );
      const { code, message } = response;

      if (!code) {
        setMessage(message);
        return;
      }

      alert("승인 거부되었습니다.");
      setPurchaseOrders(purchaseOrders);
      onGetAllPurchaseOrdersRequested();
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    }
  };

  //* 승인 로그 전체 조회

  return (
    <div>
      <button
        className="searchAll"
        onClick={onGetAllPurchaseOrdersRequested}
        style={{ margin: "0" }}
      >
        발주 요청서 업데이트
      </button>
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

export default ApprovePurchaseOrder;