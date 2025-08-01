

import { deletePublisher, getPublisher, getPublishers } from '@/apis/publisher/publisher';
import { PageResponseDto } from '@/dtos/PageResponseDto';
import { PublisherListResponseDto, PublisherResponseDto } from '@/dtos/publishers/publisher.response.dto';
import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import Createpublisher from './Createpublisher';
import UpdatePublisher from './UpdatePublisher';

const PAGE_SIZE = 10;

function Publisherpage() {

    const [cookies] = useCookies(['accessToken']);
    const token = cookies.accessToken;
    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [searh, setSearch] = useState('');
    const [publishers, setPublishers] = useState<PublisherResponseDto[]>([]);
    const [selectedDetail, setSelectedDetail] = useState<PublisherResponseDto | null>(null);
    const [selectedPublisherId, setSelectedPublisherId] = useState<number | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    const fetchPage = async (page: number, keyword? :string) => {
        if(!token) return;
        try{
            const response = await getPublishers(
                token,
                page,
                PAGE_SIZE,
                keyword
            );
    
            if(response.code ==="SU" && response.data){
                const data = response.data;
                if("content" in data){
                    setPublishers(data.content);
                    setTotalPage(data.totalPages);
                    setCurrentPage(data.currentPage);
                }else{
                    
                    
                    setPublishers(data as PublisherResponseDto[]);
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


      const deletePub = async(id: number) => {
        if(!window.confirm("정말 삭제하시겠습니까?")) return;
        if(!token) return;
        try{
            const response = await deletePublisher(id,token);
            if(response.code === "SU"){
                const isLast = publishers.length === 1&& currentPage>0;
                fetchPage(isLast ? currentPage -1 :currentPage); 
            }else{
                alert(response.message || "삭제실패");
            }
        }catch(err){
            console.log("삭제예외",err);
            alert("삭제 중 오류 발생");
        }
      };

      const openUpdateModal = async(id : number) => {
        if(!token) return;
        try{
            const response = await getPublisher(id, token);
            if(response.code === "SU" && response.data){
                setSelectedDetail(response.data);
                setSelectedPublisherId(id);
                setIsUpdateOpen(true);
            }else{
                alert(response.message);
            }
            
        }catch(err){
            console.error("상세 조회 예외", err);
            alert("상세 조회 중 오류 발생");
        }
      }

  const handleUpdateClose = () => {
    setSelectedDetail(null);
    setIsUpdateOpen(false);
  };

  const handleUpdated = () => {
    handleUpdateClose();
    fetchPage(currentPage);
  }

  const goToPage = (page : number) => {
    if(page<0 || page >=totalPage) return;
    fetchPage(page);
  };

    return (
      <div className=''>
        <div>
            <button onClick={() => setIsCreateOpen(true)} className=''> 출판사 등록</button>
        </div>

        <div className=''>
            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
            
            <button className='' onClick={() => goToPage(0)}>검색</button>
            </div>
                <table>
                    <thead>
                        <tr>
                            <th>IDX</th>
                            <th>출판사 이름</th>
                           
                            <th>수정</th>
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {publishers.map((p) => (
                            <tr key = {p.publisherId}>
                                <td>{p.publisherId}</td>
                                <td>{p.publisherName}</td>
                            
                                <td><button className = "modifyBtn" onClick={() => openUpdateModal(p.publisherId)}>수정</button></td>
                                
                                <td><button className = "deleteBtn" onClick={() => deletePub(p.publisherId)}>삭제</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <div className='pagination'>
            <button className='' disabled={currentPage===0} onClick={() => goToPage(currentPage-1)}>이전</button>
            <span>{currentPage+1}/{totalPage}</span>
            <button className='' disabled={currentPage +1 >= totalPage} onClick={() => goToPage(currentPage+1)}>다음</button>
        </div>

        {isCreateOpen &&(<Createpublisher
        isOpen = {isCreateOpen}
        onClose = {() => setIsCreateOpen(false)}
        onCreated = {() => fetchPage(currentPage)}
        />)}

        {isUpdateOpen && selectedDetail && selectedPublisherId != null && (
            <UpdatePublisher
            isOpen={isUpdateOpen}
            onClose={handleUpdateClose}
            onUpdate={handleUpdated}
            publisherDetail={selectedDetail}
            publisherId={selectedPublisherId}/>
        )}
            </div>
      
    )
}

export default Publisherpage