import { signInRequest } from "@/apis/auth/auth";
import { SignInRequestDto } from "@/dtos/auth/request/Sign-in.request.dto";
import { useEmployeeStore } from "@/stores/employee.store";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [, setCookie] = useCookies(["accessToken"]);
  const setLogin = useEmployeeStore((state) => state.setLogin);
  const setEmployee = useEmployeeStore((state) => state.setEmployee);
  const setLogoutTimer = useEmployeeStore((state) => state.setLogoutTimer);

  const [form, setForm] = useState<SignInRequestDto>({
    loginId: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    setMessage("");
  }, [form]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.loginId || !form.password) {
      setMessage("아이디와 비밀번호를 입력해주세요");
      return;
    }

    const response = await signInRequest(form);
    const { code, message, data } = response;

    if (code !== "SU" || !data) {
      alert("로그인에 실패하였습니다.");
      setMessage(message);
      return;
    }

    const { token, exprTime, employee } = data;

    if (!employee) {
      console.error("로그인 정보가 없습니다.");
      return;
    }

    const expirDate = new Date();
    expirDate.setMilliseconds(expirDate.getMilliseconds() + exprTime);

    setCookie("accessToken", token, {
      path: "/",
      expires: expirDate,
      sameSite: "strict",
    });

    setLogin();
    setEmployee(employee);
    setLogoutTimer(exprTime);

    alert("로그인에 성공하였습니다.");
    navigate("/main");
  };

  return (
    <div>
      <img src="src/apis/constants/북허브_svg_black1.png" alt="BookHub 로고" />
      <div>
        <form onSubmit={onSubmit}>
          <h2>LOGIN</h2>
          <input
            type="text"
            name="loginId"
            value={form.loginId}
            placeholder="아이디"
            onChange={onInputChange}
          />
          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="비밀번호"
            onChange={onInputChange}
          />
          {message && <p>{message}</p>}
          <button type="submit">로그인</button>
        </form>
        <p>
          <a href="/auth/sign-up">회원가입</a>
          <a href="/auth/login-id-find/email">아이디 찾기</a>
          <a href="/auth/password-change/email">비밀번호 변경</a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
