import { DisplayType } from "@/apis/enums/DisplayType";
import { updateLocation } from "@/apis/locations/LocationManager";
import { LocationUpdateRequestDto } from "@/dtos/locations/Location.request.dto";
import { LocationResponseDto } from "@/dtos/locations/Location.response.dto";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

interface UpdateLocationProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  branchId: number;
  locationId: number;
  locationDetail: LocationResponseDto | null;
}

function UpdateLocationPage({ isOpen, onClose, onUpdated, branchId, locationId, locationDetail }: UpdateLocationProps) {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;

  const [floor, setFloor] = useState("");
  const [hall, setHall] = useState("");
  const [section, setSection] = useState("");
  const [displayType, setDisplayType] = useState<DisplayType>(DisplayType.BOOK_SHELF);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (locationDetail) {
      setFloor(locationDetail.floor);
      setHall(locationDetail.hall);
      setSection((locationDetail as any).section ?? "");
      setDisplayType(locationDetail.type);
      setNote(locationDetail.note);
      setMessage("");
    }
  }, [locationDetail]);

  const onUpdateClick = async () => {
    if (!token) {
      alert("인증 토큰이 없습니다.");
      return;
    }

    const dto: LocationUpdateRequestDto = {
      floor,
      hall,
      section,
      displayType,
      note,
    };

    const res = await updateLocation(branchId, locationId, dto as any, token);
    if (res.code !== "SU") {
      setMessage(res.message);
      return;
    }
    alert("위치가 수정되었습니다");
    onUpdated();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="policy-detail-modal">
        <button className="modal-close-button" onClick={onClose}>x</button>
        <h2 className="modal-title">위치 수정</h2>
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
          <button onClick={onUpdateClick}>수정</button>
        </div>
      </div>
    </div>
  );
}

export default UpdateLocationPage;