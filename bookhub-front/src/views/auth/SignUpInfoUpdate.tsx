import { employeeUpdateRequest, verifyTokenEmployee } from "@/apis/auth/auth";
import { branchRequest } from "@/apis/branch/branch";
import { BranchSearchResponseDto } from "@/dtos/branch/response/Branch-search.response.dto";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function SignUpInfoUpdate() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [branchList, setBranchList] = useState<BranchSearchResponseDto[]>([]);
  const [verified, setVerified] = useState(false);
  const [form, setForm] = useState({
    phoneNumber: "",
    birthDate: "",
    branchId: 0,
  });
  const [message, setMessage] = useState("");

  const fetchEmployeeUpdate = async () => {
    if (!token) {
      setMessage("유효하지 않은 토큰입니다.");
      return;
    }

    try {
      const response = await verifyTokenEmployee(token);
      const { code, message } = response;

      if (code == "SU") {
        setVerified(true);
        return;
      } else {
        setMessage(message);
        return;
      }
    } catch (error) {
      setMessage("서버 오류가 발생했습니다.");
      return;
    }
  };

  useEffect(() => {
    fetchEmployeeUpdate();
    setMessage("");
  }, [token]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onButtonClick = async () => {
    if (!token) {
      setMessage("유효하지 않은 토큰입니다.");
      return;
    }

    if (!form.phoneNumber || !form.birthDate || !form.branchId) {
      setMessage("모든 항목을 입력하세요");
      return;
    }

    try {
      const response = await employeeUpdateRequest(token, form);

      const { code, message } = response;

      if (code == "SU") {
        alert("회원 정보를 성공적으로 변경되었습니다. 창을 닫습니다.");
        window.close();
        if (!closed) {
          alert(
            "창이 자동으로 닫히지 않으면 브라우저 탭을 수동으로 닫아주세요."
          );
        }
      } else {
        setMessage(message || "회원 정보 변경에 실패했습니다.");
      }
    } catch {
      setMessage("오류가 발생했습니다.");
    }
  };

  const fetchBranchSelect = async () => {
    const response = await branchRequest();
    const { code, message, data } = response;

    if (code === "SU" && data) {
      setBranchList(data);
    } else {
      setMessage(message);
    }
  };

  useEffect(() => {
    fetchBranchSelect();
  }, []);

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectBranchId = e.target.value;
    setForm({ ...form, branchId: Number(selectBranchId) });
  };

  return (
    <div>
      <p>dofwoj</p>
      {verified && (
        <div>
          <h2>회원 가입 정보 변경</h2>
          <input
            type="tel"
            placeholder="전화번호"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={onInputChange}
            required
          />
          <input
            type="date"
            placeholder="생년월일"
            name="birthDate"
            value={form.birthDate}
            onChange={onInputChange}
          />
          <select value={form.branchId} onChange={onSelectChange}>
            <option value={0}>지점을 선택하세요</option>
            {branchList.map((branch) => (
              <option key={branch.branchId} value={branch.branchId}>
                {branch.branchName}
              </option>
            ))}
          </select>
          {message && <p>{message}</p>}
          <button onClick={onButtonClick}>변경</button>
        </div>
      )}
      {!verified && <p>{message}</p>}
    </div>
  );
}

export default SignUpInfoUpdate;
