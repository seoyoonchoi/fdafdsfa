import { getLocations, getLocationDetail } from "@/apis/locations/LocationCommon";
import { branchRequest } from "@/apis/branch/branch";
import { deleteLocation } from "@/apis/locations/LocationManager";
import { LocationResponseDto } from "@/dtos/locations/Location.response.dto";
import { BranchSearchResponseDto } from "@/dtos/branch/response/Branch-search.response.dto";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import CreateLocationPage from "./CreateLocationPage";
import UpdateLocationPage from "./UpdateLocationPage";

const PAGE_SIZE = 10;

function LocationPage() {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;

  const [bookTitle, setBookTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [branchId, setBranchId] = useState<string>("");

  const [branches, setBranches] = useState<BranchSearchResponseDto[]>([]);
  const [locations, setLocations] = useState<LocationResponseDto[]>([]);
  const [message, setMessage] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<LocationResponseDto | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await branchRequest();
      if (res.code === "SU" && res.data) {
        setBranches(res.data);
      }
    })();
  }, []);

  const fetchPage = async (page: number) => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }
    const res = await getLocations(
      token,
      page,
      PAGE_SIZE,
      bookTitle || undefined,
      isbn || undefined,
      branchId ? Number(branchId) : undefined
    );

    if (res.code === "SU" && res.data) {
      setLocations(res.data.content);
      setCurrentPage(res.data.currentPage);
      setTotalPage(res.data.totalPages);
      setMessage("");
    } else {
      setLocations([]);
      setCurrentPage(0);
      setTotalPage(0);
      setMessage(res.message);
    }
  };

  const reset = () => {
    setBookTitle("");
    setIsbn("");
    setBranchId("");
    setLocations([]);
    setMessage("");
    setCurrentPage(0);
    setTotalPage(0);
  };

  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPage) return;
    fetchPage(page);
  };

  const goPrev = () => {
    if (currentPage > 0) goToPage(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < totalPage - 1) goToPage(currentPage + 1);
  };

  const handleCreated = () => {
    setIsCreateOpen(false);
    fetchPage(currentPage);
  };

  const handleUpdateClose = () => {
    setSelectedDetail(null);
    setIsUpdateOpen(false);
  };

  const handleUpdated = () => {
    handleUpdateClose();
    fetchPage(currentPage);
  };

  const openUpdateModal = async (id: number) => {
    if (!token) return;
    const res = await getLocationDetail(id, token);
    if (res.code === "SU" && res.data) {
      setSelectedDetail(res.data);
      setSelectedLocationId(id);
      setIsUpdateOpen(true);
    } else {
      alert(res.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까")) return;
    if (!token) return;
    const res = await deleteLocation(branchId ? Number(branchId) : 0, id, token);
    if (res.code === "SU") {
      const isLast = locations.length === 1 && currentPage > 0;
      fetchPage(isLast ? currentPage - 1 : currentPage);
    } else {
      alert(res.message);
    }
  };

  return (
    <div>
      <h2>도서 위치 조회</h2>
      <div className="topBar">
        <button onClick={() => setIsCreateOpen(true)}>위치 등록</button>
      </div>
      <div>
        <select value={branchId} onChange={(e) => setBranchId(e.target.value)}>
          <option value="">전체 지점</option>
          {branches.map((b) => (
            <option key={b.branchId} value={b.branchId}>
              {b.branchName}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="도서 제목"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />
        <button onClick={() => fetchPage(0)}>검색</button>
        <button onClick={reset}>초기화</button>
      </div>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>도서명</th>
            <th>층</th>
            <th>홀</th>
            <th>섹션</th>
            <th>전시 형태</th>
            <th>비고</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc, idx) => (
            <tr key={loc.locationId}>
              <td>{currentPage * PAGE_SIZE + idx + 1}</td>
              <td>{loc.bookTitle}</td>
              <td>{loc.floor}</td>
              <td>{loc.hall}</td>
              <td>{loc.section}</td>
              <td>{loc.type}</td>
              <td>{loc.note}</td>
              <td>
                <button className="modifyBtn" onClick={() => openUpdateModal(loc.locationId)}>
                  수정
                </button>
                <button className="deleteBtn" onClick={() => handleDelete(loc.locationId)}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="footer">
        <button className="pageBtn" onClick={goPrev} disabled={currentPage === 0}>
          {'<'}
        </button>
        {Array.from({ length: totalPage }, (_, i) => i).map((i) => (
          <button
            key={i}
            className={`pageBtn${i === currentPage ? ' current' : ''}`}
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
          {'>'}
        </button>
        <span className="pageText">
          {totalPage > 0 ? `${currentPage + 1} / ${totalPage}` : '0 / 0'}
        </span>
      </div>
      {isCreateOpen && (
        <CreateLocationPage
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreated={handleCreated}
          branchId={branchId ? Number(branchId) : 0}
        />
      )}
      {isUpdateOpen && selectedDetail && selectedLocationId != null && (
        <UpdateLocationPage
          isOpen={isUpdateOpen}
          onClose={handleUpdateClose}
          onUpdated={handleUpdated}
          branchId={branchId ? Number(branchId) : 0}
          locationId={selectedLocationId}
          locationDetail={selectedDetail}
        />
      )}
    </div>
  );
}

export default LocationPage;
