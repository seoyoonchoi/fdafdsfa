import {
  checkDuplicateAuthorEmail,
  deleteAuthor,
  getAllAuthorsByName,
  updateAuthor,
} from "@/apis/author/author";
import Modal from "@/apis/constants/Modal";
import { AuthorRequestDto } from "@/dtos/author/request/Author.request.dto";
import { AuthorResponseDto } from "@/dtos/author/response/Author.response.dto";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

function Author() {
  const [searchForm, setSearchForm] = useState({ authorName: "" });
  const [updateForm, setUpdateForm] = useState<AuthorRequestDto>({
    authorName: "",
    authorEmail: "",
  });
  const [authorId, setAuthorId] = useState<number>(0);
  const [authors, setAuthors] = useState<AuthorResponseDto[]>([]);
  const [message, setMessage] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const PAGE_SIZE = 10;
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchForm({ ...searchForm, [name]: value });
  };

  const onUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateForm({ ...updateForm, [name]: value });
  };

  const onSearchClick = async (page: number) => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    try {
      const response = await getAllAuthorsByName(
        { page: page, size: PAGE_SIZE, authorName: searchForm.authorName },
        token
      );

      const { code, message, data } = response;

      if (code === "SU" && data) {
        if ("content" in data) {
          setAuthors(data.content);
          setTotalPage(data.totalPages);
          setCurrentPage(data.currentPage);
        } else {
          setAuthors([]);
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

  const openUpdateModal = (author: AuthorResponseDto) => {
    setAuthorId(author.authorId);
    setUpdateForm({
      authorName: author.authorName,
      authorEmail: author.authorEmail,
    });
    setModalStatus(true);
  };

  const onUpdateClick = async (authorId: number) => {
    setModalMessage("");
    const dto = {
      authorName: updateForm.authorName,
      authorEmail: updateForm.authorEmail,
    };
    const token = cookies.accessToken;

    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    try {
      const checkResponse = await checkDuplicateAuthorEmail(
        dto.authorEmail,
        token
      );
      const { code: checkCode } = checkResponse;
      if (checkCode === "IV") {
        setModalMessage("중복된 이메일입니다.");
        return;
      }

      const updateResponse = await updateAuthor(authorId, dto, token);
      const { code: udpateCode, message } = updateResponse;

      if (udpateCode != "SU") {
        setMessage(message);

        return;
      }

      alert("수정되었습니다.");
      setModalStatus(false);
      const updatedAuthor = authors.map((author) =>
        author.authorId === authorId
          ? {
              ...author,
              authorName: updateForm.authorName,
              authorEmail: updateForm.authorEmail,
            }
          : author
      );
      setAuthors(updatedAuthor);
    } catch (error) {
      console.error(error);
      alert("수정 중 오류가 발생하였습니다.");
    }
  };

  const onDeleteClick = async (authorId: number) => {
    const token = cookies.accessToken;

    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    try {
      const response = await deleteAuthor(authorId, token);
      const { code, message } = response;

      console.log(code);
      if (code != "SU") {
        setMessage(message);
        return;
      }

      alert("삭제되었습니다.");

      const updatedAuthor = authors.filter(
        (author) => author.authorId !== authorId
      );
      setAuthors(updatedAuthor);
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생하였습니다.");
    }
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

  const authorList = authors.map((author) => {
    return (
      <tr key={author.authorId}>
        <td>{author.authorName}</td>
        <td>{author.authorEmail}</td>
        <td>
          <button onClick={() => openUpdateModal(author)}>수정</button>
          <button onClick={() => onDeleteClick(author.authorId)}>삭제</button>
        </td>
      </tr>
    );
  });

  const modalContent: React.ReactNode = (
    <>
      <div>
        <div>
          <h2>저자 수정</h2>

          <div>
            <p>저자 이름</p>
            <input
              type="text"
              name="authorName"
              value={updateForm.authorName}
              onChange={onUpdateInputChange}
              placeholder={updateForm.authorName}
            />
          </div>

          <div>
            <p>저자 이메일</p>
            <input
              type="text"
              name="authorEmail"
              value={updateForm.authorEmail}
              onChange={onUpdateInputChange}
              placeholder={updateForm.authorEmail}
            />
          </div>
          {modalMessage && <p>{modalMessage}</p>}
          <button onClick={() => onUpdateClick(authorId)}>수정</button>
        </div>
      </div>
    </>
  );

  return (
    <div>
      <h2>저자 조회</h2>
      <input
        type="text"
        name="authorName"
        value={searchForm.authorName}
        placeholder="조회할 저자 이름을 입력하세요"
        onChange={onSearchInputChange}
      />
      <button onClick={() => onSearchClick(0)}>조회</button>
      <table>
        <thead>
          <tr>
            <th>저자 이름</th>
            <th>저자 이메일</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>{authorList}</tbody>
      </table>
      {message && <p>{message}</p>}

      {modalStatus && (
        <Modal
          isOpen={modalStatus}
          onClose={() => {
            setModalStatus(false), setMessage("");
          }}
          children={modalContent}
        ></Modal>
      )}
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

export default Author;
