/** @jsxImportSource @emotion/react */
import { checkDuplicateAuthorEmail, createAuthor } from "@/apis/author/author";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { AuthorRequestDto } from "@/dtos/author/request/Author.request.dto";
import { AuthorCreateRequestDto } from "@/dtos/author/request/Author-create.request.dto";
import Author from "./Author";

// 여러건 동시 등록
function CreateAuthor() {
  const [form, setForm] = useState({
    authorName: "",
    authorEmail: "",
  });
  const [authors, setAuthors] = useState<AuthorRequestDto[]>([]);
  const [message, setMessage] = useState("");
  const [cookies] = useCookies(["accessToken"]);
  const emailRegex = /^[A-Za-z][A-Za-z\d]+@[A-Za-z\d.-]+\.[A-Za-z]{2,}$/;

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 추가 버튼 클릭 -> 리스트에 추가됨
  const onAddAuthor = async () => {
    const { authorName, authorEmail } = form;
    const token = cookies.accessToken;

    if (!token) {
      alert("인증 토큰이 없습니다.");
    }

    if (!authorName || !authorEmail) {
      setMessage("모든 항목을 입력해주세요");
      return;
    }

    if (!emailRegex.test(authorEmail)) {
        setMessage("이메일 형식이 아닙니다.");
        return;
      }

    const response = await checkDuplicateAuthorEmail(form.authorEmail, token);
    const { code, message } = response;
    if (code !== "SU") {
      console.log(code);
      setMessage(message);
      setForm({
        authorName: `${authorName}`,
        authorEmail: "",
      });
      return;
    }

    const isDuplicateEmail = (
      authors: AuthorRequestDto[],
      authorEmail: string
    ) => {
      return authors.some((author) => author.authorEmail === authorEmail);
    };

    if (isDuplicateEmail(authors, authorEmail)) {
      setMessage("중복된 이메일입니다.");
      setForm({
        authorName: `${authorName}`,
        authorEmail: "",
      });
      return;
    }

    const newAuthor: AuthorRequestDto = { authorName, authorEmail };
    setAuthors([...authors, newAuthor]);

    setForm({ authorName: "", authorEmail: "" });

    setMessage("");
  };

  const authorList = authors.map((author, index) => {
    return (
      <tr key={index}>
        <td>{author.authorName}</td>
        <td>{author.authorEmail}</td>
      </tr>
    );
  });

  // 등록 버튼 클릭 -> 저자 리스트 등록(저장)
  const onCreateAuthorClick = async () => {
    if (authors.length === 0) {
      setMessage("등록하실 저자를 입력 후 추가 버튼을 눌러주세요.");
      return;
    }

    const requestBody: AuthorCreateRequestDto = { authors };
    const token = cookies.accessToken;

    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    try {
      const response = await createAuthor(requestBody, token);
      const { code, message } = response;

      if (code != "SU") {
        setMessage(message);
        return;
      }

      setMessage("등록이 완료되었습니다.");
      setAuthors([]);
    } catch (error) {
      console.error(error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <div>
        <h2>저자 등록</h2>
        <button onClick={onCreateAuthorClick}>등록</button>
        {message && <p>{message}</p>}

        <table>
          <thead>
            <tr>
              <th>저자 이름</th>
              <th>저자 이메일</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="등록하실 저자 이름을 입력하세요."
                  name="authorName"
                  value={form.authorName}
                  onChange={onInputChange}
                />
              </td>
              <td>
                <input
                  type="email"
                  placeholder="등록하실 저자 이메일을 입력하세요."
                  name="authorEmail"
                  value={form.authorEmail}
                  onChange={onInputChange}
                />
              </td>
              <td>
                <button onClick={onAddAuthor}>추가</button>
              </td>
            </tr>
            {authorList}
          </tbody>
        </table>
      </div>
      <div></div>
      <div>
        <Author />
      </div>
    </div>
  );
}
export default CreateAuthor;
