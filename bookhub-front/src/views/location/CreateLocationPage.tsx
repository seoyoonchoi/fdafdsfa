import { DisplayType } from "@/apis/enums/DisplayType";
import { createLocation } from "@/apis/locations/LocationManager";
import { LocationCreateRequestDto } from "@/dtos/locations/Location.request.dto";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

interface CreateLocationProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  branchId: number;
}

function CreateLocationPage({ isOpen, onClose, onCreated, branchId }: CreateLocationProps) {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;

  const [bookIsbn, setBookIsbn] = useState("");
  const [floor, setFloor] = useState("");
  const [hall, setHall] = useState("");
  const [section, setSection] = useState("");
  const [displayType, setDisplayType] = useState<DisplayType>(DisplayType.BOOK_SHELF);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const onCreateClick = async () => {
    if (!bookIsbn.trim()) {
      setMessage("ISBN을 입력하세요");
      return;
    }
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    const dto: LocationCreateRequestDto = {
      bookIsbn,
      floor,
      hall,
      section,
      displayType,
      note,
    };

    const res = await createLocation(branchId, dto, token);
    if (res.code !== "SU") {
      setMessage(res.message);
      return;
    }
    alert("도서 위치가 등록되었습니다");
    onCreated();
    onClose();
    setBookIsbn("");
    setFloor("");
    setHall("");
    setSection("");
    setDisplayType(DisplayType.BOOK_SHELF);
    setNote("");
    setMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="policy-detail-modal">
        <button className="modal-close-button" onClick={onClose}>
          x
        </button>
        <h2 className="modal-title">위치 등록</h2>
        <div className="form-group">
          <label>ISBN</label>
          <input
            type="text"
            value={bookIsbn}
            onChange={(e) => setBookIsbn(e.target.value)}
            placeholder="도서 ISBN"
          />
        </div>
        <div className="form-group two-cols">
          <div>
            <label>층</label>
            <input type="text" value={floor} onChange={(e) => setFloor(e.target.value)} />
          </div>
          <div>
            <label>홀</label>
            <input type="text" value={hall} onChange={(e) => setHall(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label>섹션</label>
          <input type="text" value={section} onChange={(e) => setSection(e.target.value)} />
        </div>
        <div className="form-group">
          <label>전시 형태</label>
          <select value={displayType} onChange={(e) => setDisplayType(e.target.value as DisplayType)}>
            <option value={DisplayType.BOOK_SHELF}>책장</option>
            <option value={DisplayType.DISPLAY_TABLE}>전시대</option>
          </select>
        </div>
        <div className="form-group">
          <label>비고</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        {message && <p className="error-message">{message}</p>}
        <div className="modal-footer">
          <button onClick={onCreateClick}>등록</button>
        </div>
      </div>
    </div>
  );
}

export default CreateLocationPage;