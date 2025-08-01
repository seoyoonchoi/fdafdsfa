import { PolicyType } from "@/apis/enums/PolicyType";
import { getPolicies, getPolicyDetail } from "@/apis/policies/PolicyCommon";
import { PolicyDetailResponseDto, PolicyListResponseDto } from "@/dtos/policy/Policy.response.dto";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import PolicyDetail from "./PolicyDetail";

const PAGE_SIZE = 10;

function PolicySearch() {
  const [cookies] = useCookies(['accessToken']);
  const token = cookies.accessToken;

  const [keyword, setKeyword] = useState('');
  const [policyType, setPolicyType] = useState<PolicyType | ''>('');
  const [discountPercent, setDiscountPercent] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [policies, setPolicies] = useState<PolicyListResponseDto[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<PolicyDetailResponseDto | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  

  const fetchPage = async (page: number) => {
    if(!token) return;
    try{
        const response = await getPolicies(
            token,
            page,
            PAGE_SIZE,
            keyword.trim() || undefined,
            policyType || undefined,
            startDate || undefined,
            endDate || undefined
        );

        if(response.code ==="SU" && response.data){
            const data = response.data;
            if("content" in data){
                setPolicies(data.content);
                setTotalPage(data.totalPages);
                setCurrentPage(data.currentPage);
            }else{
                setPolicies(data as PolicyListResponseDto[]);
                setTotalPage(1);
                setCurrentPage(0);
            }
        }else{
            console.error("목록 조회 실패", response.message);
        }
    }catch (err){
        console.error("목록 조회 예외",err);
    }
  };

  useEffect(() => {
    fetchPage(0);
  },[token,keyword,policyType,startDate,endDate]);

  const openDetailModal =  async (id : number) => {
    if(!token) return;
    try {
        const response = await getPolicyDetail(id,token);
        if(response.code === "SU" && response.data){
            setSelectedDetail(response.data);
            setSelectedPolicyId(id);
            setIsDetailOpen(true);
        }else{
            alert(response.message);
        }
    }catch(err){
        console.log("상세 조회 예외",err);
        alert("상세 조회 중 오류 발생");
    }
  };


  const handleDetailClose = () => {
    setSelectedDetail(null);
    setIsDetailOpen(false);
  };


  const goToPage = (page : number) => {
    if(page<0 || page >=totalPage) return;
    fetchPage(page);
  };

 
  return (
    <div className='policy-page-container'>
        <div className='filter-bar'>
            <select className='input-search' value={policyType} onChange={(e) => setPolicyType(e.target.value as PolicyType)}>
                <option value="">전체</option>
                <option value={PolicyType.BOOK_DISCOUNT}>도서 할인</option>
                <option value={PolicyType.CATEGORY_DISCOUNT}>카테고리 할인</option>
                <option value={PolicyType.TOTAL_PRICE_DISCOUNT}>총 금액 할인</option>
            </select>
            <input className='input-search' type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
        <input className='input-search' type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
        <input className = 'input-search' type="text" placeholder='제목검색' value={keyword} onChange={(e) => setKeyword(e.target.value) } onKeyDown={(e) =>e.key === "Enter" && goToPage(0)} />
        <input className = 'input-search' type="number" placeholder='할인율(%)' value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value=== ""?"":Number(e.target.value)) } />

    <button className='' onClick={() => goToPage(0)}>검색</button>
        </div>
        <table className='table-policy'>
            <thead>
                <tr>
                    <th>IDX</th>
                    <th>제목</th>
                    <th>타입</th>
                    <th>시작일</th>
                    <th>종료일</th>
                    <th>작업</th>
                </tr>
            </thead>
            <tbody>
                {policies.map((p) => (
                    <tr key = {p.policyId}>
                        <td></td>
                        <td>{p.policyTitle}</td>
                        <td>{p.policyType}</td>
                        <td>{p.startDate}</td>
                        <td>{p.endDate}</td>
                        <td>
                            <button className = "modifyBtn" onClick={() => openDetailModal(p.policyId)}>보기</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className='pagination'>
            <button className='' disabled={currentPage===0} onClick={() => goToPage(currentPage-1)}>이전</button>
            <span>{currentPage+1}/{totalPage}</span>
            <button className='' disabled={currentPage +1 >= totalPage} onClick={() => goToPage(currentPage+1)}>다음</button>
        </div>

        {isDetailOpen && selectedDetail && selectedPolicyId != null && (
            <PolicyDetail
            isOpen={isDetailOpen}
            onClose={handleDetailClose}
            policyDetail={selectedDetail}/>
        )}


    </div>

  );
};

export default PolicySearch;