import {
  passwordChangeRequest,
  verifyPasswordChangeToken,
} from "@/apis/auth/auth";
import { PasswordChangeRequestDto } from "@/dtos/auth/request/Password-change.request.dto";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function PasswordChange() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [verified, setVerifed] = useState(false);
  const [form, setForm] = useState<PasswordChangeRequestDto>({
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const fetchPasswordChange = async () => {
    if (!token) {
      setMessage("유효하지 않은 토큰입니다.");
      return;
    }

    const response = await verifyPasswordChangeToken(token);
    const { code, message } = response;

    if (code === "SU") {
      setVerifed(true);
      setMessage("");
      return;
    } else {
      setMessage(message);
      return;
    }
  };

  useEffect(() => {
    fetchPasswordChange();
    setMessage("");
  }, [token, form]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onPasswordChangeButtonClick = async () => {
    if (!token) {
      setMessage("유효하지 않은 토큰입니다.");
      return;
    }

    if (!form.password || !form.confirmPassword) {
      setMessage("모든 항목을 입력하세요.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    const response = await passwordChangeRequest(token, form);
    const { code, message } = response;

    if (code === "SU") {
      alert("비밀번호가 성공적으로 변경되었습니다. 창을 닫습니다.");
      window.close();
      if (!closed) {
        alert("창이 닫히지 않았습니다. 창을 닫아주세요.");
      }
    } else {
      setMessage(message);
    }
  };

  return (
    <div>
      <img src="src/apis/constants/북허브_svg_black1.png" alt="BookHub 로고" />
      {verified && (
        <div>
          <h2>비밀번호 변경</h2>
          <input
            type="password"
            placeholder="비밀번호"
            name="password"
            value={form.password}
            onChange={onInputChange}
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onInputChange}
          />
          {message && <p>{message}</p>}
          <button onClick={onPasswordChangeButtonClick}>비밀번호 변경</button>
        </div>
      )}
      {!verified && <p>{message}</p>}
    </div>
  );
}

export default PasswordChange;
