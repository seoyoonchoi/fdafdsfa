import { StockActionType } from '@/apis/enums/StockActionType';
import { getStockLogDetail, getStockLogs } from '@/apis/stocks/StockLog';
import { StockLogResponseDto } from '@/dtos/stock/StockLog.response.dto';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import StockLogdetail from './StockLogdetail';
import { StockProps } from '@/components/types/StockProps';



const PAGE_SIZE = 10;
function StockLogPage({
  branches = [],
}: StockProps) {
  const [cookies] = useCookies(['accessToken']);
  const accessToken = cookies.accessToken;

  const [type, setType] = useState<StockActionType | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [employeeName, setEmployeeName] = useState<string | ''>('');
  const [branchId, setBranchId] = useState<number|undefined>(undefined);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [stocklogs, setStocklogs] = useState<StockLogResponseDto[]>([]);
  const [selectedStockLogId, setSelectedStockLogId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<StockLogResponseDto | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchPage = async (page : number) => {
    if(!accessToken) return;
    try{
      const response = await getStockLogs(
        accessToken,
        page,
        PAGE_SIZE,
        keyword.trim() || undefined,
        branchId || undefined,
        type || undefined,
        startDate || undefined,
        endDate || undefined
      );

      if(response.code === "SU" && response.data){
        const data = response.data;
        if("content" in data){
          setStocklogs(data.content);
          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage);
        }else{
          setStocklogs(data as StockLogResponseDto[]);
          setTotalPages(1);
          setCurrentPage(0);
        }
      }
    }catch(err){
      console.error("목록 조회 예외",err);

    }
  };

  useEffect(() => {
    fetchPage(0);
  },[accessToken,keyword,branchId,type,startDate,endDate]);

  const openDetailModal = async (id:number) => {
    if(!accessToken) return;
    try{
      const response = await getStockLogDetail(id,accessToken);
      if(response.code === "SU" && response.data){
        setSelectedDetail(response.data);
        setSelectedStockLogId(id);
        setIsDetailOpen(true);
      }else{
        alert(response.message);
      }
    }catch(err){
       console.log("상세 조회 예외",err);
        alert("상세 조회 중 오류 발생");

    }
  }

   const handleDetailClose = () => {
    setSelectedDetail(null);
    setIsDetailOpen(false);
  };

    const goToPage = (page : number) => {
    if(page<0 || page >=totalPages) return;
    fetchPage(page);
  };


  return (

    
    <div>
      <div>
        <select className='' value={type} onChange={(e) => setType(e.target.value as StockActionType)}>
          <option value="">전체</option>
          <option value={StockActionType.IN}>입고</option>
          <option value={StockActionType.OUT}>출고</option>
          <option value={StockActionType.LOSS}>손실</option>
        </select>

        <input className='input-search' type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
        <input className='input-search' type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
        <input className = 'input-search' type="text" placeholder='책 제목 검색' value={keyword} onChange={(e) => setKeyword(e.target.value) } onKeyDown={(e) =>e.key === "Enter" && goToPage(0)} />
        <select className='' value={branchId ?? ''} onChange={e=> {
          const v = e.target.value
          setBranchId(v === ''? undefined : Number(v))
        }}>
          <option value="" disabled>지점을 선택하세요</option>
          {branches.map(branch => {return(
            <option key = {branch.id} value={branch.id}> {branch.name}</option>)
          })}

        </select>

        <button className='' onClick={() => goToPage(0)}>검색</button>
        <div>
          <table className=''>
            <thead>
              <tr>
                <th>IDX</th>
                <th>직원</th>
                <th>제목</th>
                <th>지점</th>
                <th>출고량</th>
                <th>활동</th>
                <th>보기</th>
              </tr>
            </thead>
            <tbody>
              {stocklogs.map((s) => (
                <tr key = {s.stockLogId}>
                  <td></td>
                  <td>{s.employeeName}</td>
                  <td>{s.bookTitle}</td>
                  <td>{s.branchName}</td>
                  <td>{s.amount}</td>
                  <td>{s.type}</td>
                  <td>
                    <button className='' onClick={() => openDetailModal(s.stockLogId)}>보기</button>
                  </td>

                  </tr>
              ))}
            </tbody>
          </table>

               <div className='pagination'>
            <button className='' disabled={currentPage===0} onClick={() => goToPage(currentPage-1)}>이전</button>
            <span>{currentPage+1}/{totalPages}</span>
            <button className='' disabled={currentPage +1 >= totalPages} onClick={() => goToPage(currentPage+1)}>다음</button>
        </div>

        {isDetailOpen && selectedDetail && selectedStockLogId != null && (
          <StockLogdetail
          isOpen = {isDetailOpen}
           onClose={handleDetailClose}
           stockLogDetail={selectedDetail}
          />
        )}
        </div>



      </div>
    </div>
  )
}

export default StockLogPage