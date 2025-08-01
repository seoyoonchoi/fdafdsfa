import {
  checkEmailDuplicate,
  checkLoginIdDuplicate,
  checkPhoneNumberDuplicate,
  signUpRequest,
} from "@/apis/auth/auth";
import { branchRequest } from "@/apis/branch/branch";
import { SignUpRequestDto } from "@/dtos/auth/request/Sign-up.request.dto";
import { BranchDetailResponseDto } from "@/dtos/branch/response/Branch-detail.response.dto";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const LoginUrl = "/auth/login";
  const [branches, setBranches] = useState<BranchDetailResponseDto[]>([]);
  const [form, setForm] = useState<SignUpRequestDto>({
    loginId: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    branchId: 0,
  });
  const [message, setMessage] = useState("");

  const loginRegex = /^[A-Za-z][A-Za-z\d]{3,12}/;
  const [loginIdExistsMessage, setLoginIdExistsMessage] = useState("");
  const [loginIdNotExistsMessage, setLoginIdNotExistsMessage] = useState("");

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%*?])[A-Za-z\d!@#$%*?]{8,16}$/;
  const [passwordFailCheckMessage, setPasswordFailCheckMessage] = useState("");
  const [passwordSuccessCheckMessage, setPasswordSuccessCheckMessage] =
    useState("");

  const emailRegex = /^[A-Za-z][A-Za-z\d]+@[A-Za-z\d.-]+\.[A-Za-z]{2,}$/;
  const [emailExistsMessage, setEmailExistsMessage] = useState("");
  const [emailNotExistsMessage, setEmailNotExistsMessage] = useState("");

  const phoneNumberRegex = /^010\d{8}$/;
  const [phoneNumberExistsMessage, setPhoneNumberExistsMessage] = useState("");
  const [phoneNumberNotExistsMessage, setPhoneNumberNotExistsMessage] =
    useState("");

  const onInputOrSelectChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onPasswordBlur = async () => {
    if (form.password) {
      if (!passwordRegex.test(form.password)) {
        setPasswordFailCheckMessage(
          "8~16자 영문, 숫자, 특수문자 모두 포함되어야 합니다."
        );
        return;
      }
    }

    if (form.confirmPassword && form.password) {
      if (form.password !== form.confirmPassword) {
        setPasswordFailCheckMessage("비밀번호가 일치하지 않습니다.");
        return;
      } else {
        setPasswordSuccessCheckMessage("비밀번호가 일치합니다.");
        return;
      }
    }
  };

  const onCheckLoginIdBlur = async () => {
    if (form.loginId) {
      if (!loginRegex.test(form.loginId)) {
        setLoginIdExistsMessage(
          "아이디는 4~12자의 영어와 숫자만 사용해야 합니다."
        );
        return;
      }

      const response = await checkLoginIdDuplicate(form.loginId);
      const { code, message } = response;

      if (code === "SU") {
        setLoginIdNotExistsMessage(message);
        return;
      } else {
        setLoginIdExistsMessage(message);
        return;
      }
    }
  };

  const onCheckEmailBlur = async () => {
    if (form.email) {
      if (!emailRegex.test(form.email)) {
        setEmailExistsMessage("이메일 형식이 아닙니다.");
        return;
      }

      const response = await checkEmailDuplicate(form.email);
      const { code, message } = response;

      if (code === "SU") {
        setEmailNotExistsMessage(message);
      } else {
        setEmailExistsMessage(message);
      }
    }
  };

  const onCheckPhoneNumberBlur = async () => {
    if (form.phoneNumber) {
      if (!phoneNumberRegex.test(form.phoneNumber)) {
        setPhoneNumberExistsMessage("전화번호가 아닙니다.");
        return;
      }

      const response = await checkPhoneNumberDuplicate(form.phoneNumber);
      const { code, message } = response;

      if (code === "SU") {
        setPhoneNumberNotExistsMessage(message);
      } else {
        setPhoneNumberExistsMessage(message);
      }
    }
  };

  const fetchBranchSelect = async () => {
    const response = await branchRequest();
    const { code, message, data } = response;

    if (code === "SU" && data) {
      setBranches(data);
    } else {
      setMessage(message);
    }
  };

  useEffect(() => {
    fetchBranchSelect();
  }, []);

  useEffect(() => {
    setLoginIdExistsMessage("");
    setLoginIdNotExistsMessage("");
  }, [form.loginId]);

  useEffect(() => {
    setPasswordFailCheckMessage("");
    setPasswordSuccessCheckMessage("");
  }, [form.password, form.confirmPassword]);

  useEffect(() => {
    setEmailExistsMessage("");
    setEmailNotExistsMessage("");
  }, [form.email]);

  useEffect(() => {
    setPhoneNumberExistsMessage("");
    setPhoneNumberNotExistsMessage("");
  }, [form.phoneNumber]);

  useEffect(() => {
    setMessage("");
  }, [form.name, form.birthDate, form.branchId]);

  const onSignUpClick = async () => {
    if (
      !form.name &&
      !form.birthDate &&
      (!form.branchId || form.branchId === 0)
    ) {
      setMessage("모든 항목을 입력해주세요.");
      return;
    }

    const response = await signUpRequest(form);
    const { code, message } = response;

    if (code !== "SU") {
      alert("회원가입에 실패하였습니다.");
      setMessage(message);
    } else {
      alert("회원가입에 성공하였습니다.");
      navigate(LoginUrl);
    }
  };

  const onLogoClick = () => {
    navigate(LoginUrl);
  };

  return (
    <div>
      <img
        src="src/apis/constants/북허브_svg_black1.png"
        alt="BookHub 로고"
        onClick={onLogoClick}
      />
      <div>
        <h2>SIGN UP</h2>
        <input
          type="text"
          placeholder="아이디 (영문으로 시작, 4~12자 영문/숫자 조합)"
          name="loginId"
          value={form.loginId}
          onChange={onInputOrSelectChange}
          onBlur={onCheckLoginIdBlur}
        />
        <br />
        {loginIdExistsMessage && <p>{loginIdExistsMessage}</p>}
        {loginIdNotExistsMessage && <p>{loginIdNotExistsMessage}</p>}
        <input
          type="password"
          placeholder="비밀번호 (8~16자 영문, 숫자, 특수문자 모두 포함)"
          name="password"
          value={form.password}
          onChange={onInputOrSelectChange}
          onBlur={onPasswordBlur}
        />
        <br />
        <input
          type="password"
          placeholder="비밀번호 확인"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={onInputOrSelectChange}
          onBlur={onPasswordBlur}
        />
        <br />
        {passwordFailCheckMessage && <p>{passwordFailCheckMessage}</p>}
        {passwordSuccessCheckMessage && <p>{passwordSuccessCheckMessage}</p>}
        <input
          type="name"
          placeholder="이름"
          name="name"
          value={form.name}
          onChange={onInputOrSelectChange}
        />
        <br />
        <input
          type="email"
          placeholder="이메일"
          name="email"
          value={form.email}
          onChange={onInputOrSelectChange}
          onBlur={onCheckEmailBlur}
        />
        <br />
        {emailExistsMessage && <p>{emailExistsMessage}</p>}
        {emailNotExistsMessage && <p>{emailNotExistsMessage}</p>}
        <input
          type="tel"
          placeholder="전화번호"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={onInputOrSelectChange}
          onBlur={onCheckPhoneNumberBlur}
        />
        <br />
        {phoneNumberExistsMessage && <p>{phoneNumberExistsMessage}</p>}
        {phoneNumberNotExistsMessage && <p>{phoneNumberNotExistsMessage}</p>}
        <input
          type="date"
          placeholder="생년월일"
          name="birthDate"
          value={form.birthDate}
          onChange={onInputOrSelectChange}
        />
        <br />
        <select name="branchId" value={form.branchId} onChange={onInputOrSelectChange}>
          <option value={0}>지점을 선택하세요</option>
          {branches.map((branch) => (
            <option key={branch.branchId} value={branch.branchId}>
              {branch.branchName}
            </option>
          ))}
        </select>
        <br />
        {message && <p>{message}</p>}
        <button onClick={onSignUpClick}>회원가입</button>
      </div>
    </div>
  );
}

export default SignUp;
