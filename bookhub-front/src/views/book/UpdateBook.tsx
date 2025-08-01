import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { updateBook, hideBook } from "@/apis/book/book";
import { BookUpdateRequestDto } from "@/dtos/book/request/Book.request.dto";
import { BookResponseDto } from "@/dtos/book/response/Book.response.dto";

interface UpdateBookProps {
  book: BookResponseDto;
  onSuccess: () => Promise<void>;
}

function UpdateBook({ book, onSuccess }: UpdateBookProps) {
  const [cookies] = useCookies(["accessToken"]);

  const [bookPrice, setBookPrice] = useState<number>(book.bookPrice);
  const [description, setDescription] = useState(book.description ?? "");
  const [policyId, setPolicyId] = useState<number | null>(book.policyId ?? null);
  const [categoryId, setCategoryId] = useState<number | null>(book.categoryId ?? null);
  const [bookStatus, setBookStatus] = useState<'ACTIVE' | 'INACTIVE' | 'HIDDEN'>(book.bookStatus ?? 'ACTIVE');
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = cookies.accessToken?.trim();
    if (!token) return;

    const dto: BookUpdateRequestDto = {
      isbn: book.isbn,
      bookPrice,
      description,
      bookStatus,
      ...(policyId !== null ? { policyId } : {}),
      categoryId,
    };

    try {
      const res = await updateBook(book.isbn, dto, token, coverFile);
      if (res.code !== "SU") throw new Error(res.message);
      alert("수정 성공");
      await onSuccess();
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  const handleHide = async () => {
    const token = cookies.accessToken;
    if (!token) return;

    try {
      const res = await hideBook(book.isbn, token);
      if (res.code !== "SU") throw new Error(res.message);
      alert("삭제(HIDDEN) 처리됨");
      await onSuccess();
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <table>
        <thead>
          <tr>
            <th>설명</th>
            <th>가격</th>
            <th>정책ID</th>
            <th>카테고리ID</th>
            <th>상태</th>
            <th>표지</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="설명" />
            </td>
            <td>
              <input type="number" value={bookPrice ?? ""} onChange={(e) => setBookPrice(Number(e.target.value))} placeholder="가격" />
            </td>
            <td>
              <input type="number" value={policyId ?? ""} onChange={(e) => setPolicyId(Number(e.target.value))} placeholder="정책ID (선택)" />
            </td>
            <td>
              <input
                type="number"
                value={categoryId ?? ""}
                onChange={(e) => setCategoryId(e.target.value === "" ? null : Number(e.target.value))}
                placeholder="카테고리ID"
              />
            </td>
            <td>
              <select value={bookStatus} onChange={(e) => setBookStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}>
                <option value="ACTIVE">활성</option>
                <option value="INACTIVE">비활성</option>
              </select>
            </td>
            <td>
              <input type="file" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
            </td>
            <td>
              <button type="submit">수정</button>
              <button type="button" onClick={handleHide}>삭제(HIDDEN)</button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}

export default UpdateBook;
