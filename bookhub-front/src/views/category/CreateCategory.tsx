import { createCategory, getRootCategories } from '@/apis/category/category';
import { CategoryCreateRequestDto } from '@/dtos/category/request/Category.request.dto';
import { CategoryTreeResponseDto } from '@/dtos/category/response/Category.response.dto';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';

interface CreateCategoryProps {
  onSuccess: () => Promise<void>;
}

function CreateCategory({ onSuccess }: CreateCategoryProps) {
  const [cookies] = useCookies(["accessToken"]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState<"DOMESTIC" | "FOREIGN">("DOMESTIC");
  const [categoryLevel, setCategoryLevel] = useState<1 | 2>(1);
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
  const [parentCategories, setParentCategories] = useState<CategoryTreeResponseDto[]>([]);
  const [message, setMessage] = useState("");

  const token = cookies.accessToken;
  if(!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  useEffect(() => {
    if (categoryLevel !==2 || !token) {
      setParentCategories([]);
      return;
    }

    getRootCategories(token).then((res) => {
      if (res.code === "SU") {
        const all = res.data ?? [];
        const filtered = all.filter((cat) => cat.categoryType === categoryType);
        setParentCategories(filtered);
      } else {
        alert("대분류 조회 실패");
      }
    });
  }, [categoryLevel, categoryType, token]);

  const onCreateClick = async () => {
    if (!categoryName.trim()) {
      setMessage("카테고리 이름을 입력해주십시오.");
      return;
    }

    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    const dto: CategoryCreateRequestDto = {
      categoryName,
      categoryType,
      categoryLevel,
      parentCategoryId: categoryLevel === 2 ? parentCategoryId ?? undefined : undefined,
    };

    try {
      const response = await createCategory(dto, token);
      if (response.code !== "SU") {
        setMessage(response.message);
        return;
      }

      alert("카테고리 등록 성공!");
      onSuccess();
      setCategoryName("");
      setCategoryType("DOMESTIC");
      setCategoryLevel(1);
      setParentCategoryId(null);
      setParentCategories([]);
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("카테고리 등록 실패");
    }
  };

  return (
    <div>
      <h2>카테고리 등록</h2>
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="카테고리 이름"/>

        <select
          value={categoryType}
          onChange={(e) => setCategoryType(e.target.value as "DOMESTIC" | "FOREIGN")}
          className="de-input">
            <option value="DOMESTIC">국내도서</option>
            <option value="FOREIGN">해외도서</option>
          </select>

          <div>
            <label>
              <input
                type="radio"
                name="categoryLevel"
                value={1}
                checked={categoryLevel === 1}
                onChange={() => setCategoryLevel(1)}/>
                대분류
            </label>
            <label>
              <input
                type="radio"
                name="categoryLevel"
                value={2}
                checked={categoryLevel === 2}
                onChange={() => setCategoryLevel(2)}/>
                소분류
            </label>
          </div>

          {categoryLevel === 2 && (
            <select
              value={parentCategoryId ?? ""}
              onChange={(e) => setParentCategoryId(Number(e.target.value))}
              required>
                <option value="">상위 카테고리 선택</option>
                {parentCategories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
          )}

          {message && <p>{message}</p>}

          <div>
            <button onClick={onCreateClick}>등록</button>
          </div>
    </div>
  );
}

export default CreateCategory