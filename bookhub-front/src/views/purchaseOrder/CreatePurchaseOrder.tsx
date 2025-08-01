import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { createPurchaseOrder } from "@/apis/purchaseOrder/purchaseOrder";
import { PurchaseOrderRequestDto, PurchaseOrderCreateRequestDto } from "@/dtos/purchaseOrder/PurchaseOrder.request.dto";

function CreatePurchaseOrder() {
  const [cookies] = useCookies(["accessToken"]);
  const [form, setForm] = useState<PurchaseOrderRequestDto>({
    isbn: "",
    purchaseOrderAmount: 0,
  });
  const [orders, setOrders] = useState<PurchaseOrderRequestDto[]>([]);
  const [message, setMessage] = useState("");

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "purchaseOrderAmount" ? Number(value) : value });
  };

  const onAddOrder = () => {
    const { isbn, purchaseOrderAmount } = form;
    if (!isbn || purchaseOrderAmount <= 0) {
      setMessage("ISBN과 수량을 입력해주세요.");
      return;
    }
    setOrders([...orders, { isbn, purchaseOrderAmount }]);
    setForm({ isbn: "", purchaseOrderAmount: 0 });
    setMessage("");
  };

  const onCreateOrders = async () => {
    if (orders.length === 0) {
      setMessage("등록할 발주서를 추가해주세요.");
      return;
    }

    const token = cookies.accessToken;
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    const dto: PurchaseOrderCreateRequestDto = { purchaseOrders: orders };
    try {
      const response = await createPurchaseOrder(dto, token);
      if (response.code !== "SU") {
        setMessage(response.message);
        return;
      }
      setOrders([]);
      setMessage("등록이 완료되었습니다.");
    } catch (error) {
      console.error(error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  const orderList = orders.map((order, index) => (
    <tr key={index}>
      <td>{order.isbn}</td>
      <td>{order.purchaseOrderAmount}</td>
    </tr>
  ));

  return (
    <div>
      <h3>발주 요청</h3>
      <button onClick={onCreateOrders}>등록</button>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>ISBN</th>
            <th>수량</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                name="isbn"
                value={form.isbn}
                onChange={onInputChange}
                placeholder="ISBN"
              />
            </td>
            <td>
              <input
                type="number"
                name="purchaseOrderAmount"
                value={form.purchaseOrderAmount}
                onChange={onInputChange}
                placeholder="수량"
              />
            </td>
            <td>
              <button onClick={onAddOrder}>추가</button>
            </td>
          </tr>
          {orderList}
        </tbody>
      </table>
    </div>
  );
}

export default CreatePurchaseOrder;

