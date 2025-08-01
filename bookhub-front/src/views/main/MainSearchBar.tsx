// src/components/MainSearchBar.tsx
import React, { useState } from 'react';
import { BiSearchAlt } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom';
import './MainSearchBar.css';

const featureRoutes = {
  "재고 현황": "/stocks",
  "진열위치 관리": "/branch/locations",
  "발주서 작성": "/purchase-order/create",
  "발주서 조회/수정/삭제": "/purchase-order/else",
  "수령 내역 조회": "/reception/confirmed",
  "수령 확인": "/reception/pending",
  "정책 조회": "/policies",
  "정책 관리": "/policies/admin",
  "총합 베스트셀러": "/best-seller",
  "기간별 베스트셀러": "/best-seller/period",
  "카테고리별 베스트셀러": "/best-seller/category",
  "책 검색": "/books/search",
  "작가 관리": "/author/create",
  "출판사 관리": "/publishers",
  "카테고리 관리": "/categories",
  "책 등록": "/books/create",
  "책 수정 및 삭제": "/books/edit",
  "책 로그": "/booklogs",
  "지점 조회": "/branches",
  "지점 등록 및 삭제": "/branches/manage",
  "로그인 승인": "/employees/approval",
  "사원 정보 수정": "/employees/edit",
  "사원 정보 조회": "/employees",
  "퇴사자 로그 조회": "/employees/retired/logs",
  "회원 정보 로그 조회": "/employees/logs",
  "회원가입승인 로그 조회": "/approval/logs",
  "발주 승인": "/purchase-order/approve",
  "발주 승인 기록": "/purchase-order-approval",
  "수령 확인 내역": "/reception/logs",
  "재고 로그 관리": "/stock-logs",
  "매출 통계": "/statistics/revenue",
  "재고 통계": "/statistics/stocks",
  "판매량 통계": "/statistics/sales-quantity/period",
  "알림": "/alerts"
} as const;

type FeatureKey = keyof typeof featureRoutes;

function MainSearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<FeatureKey[]>([]);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const matches = Object.keys(featureRoutes).filter((key) =>
      key.includes(value)
    ) as FeatureKey[];
    setSuggestions(matches);
  };

  const handleSearch = () => {
    if (Object.prototype.hasOwnProperty.call(featureRoutes, query)) {
      const route = featureRoutes[query as FeatureKey];
      navigate(route);
    } else {
      alert("해당 기능이 존재하지 않습니다.");
    }
  };

  return (
    <div className="search-bar-container">
      <span className="search-label">통합검색</span>
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="검색어를 입력해주세요."
            value={query}
            onChange={handleChange}
          />
          <button onClick={handleSearch} className="search-icon-button" aria-label="검색">
            <BiSearchAlt className="search-icon" />
          </button>
        {suggestions.length > 0 && (
          <ul className="suggestion-list">
          {suggestions.map((sug) => (
            <li
            key={sug}
            onClick={() => {
              setQuery(sug);
              setSuggestions([]);
            }}
            >
              {sug}
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}

export default MainSearchBar;
