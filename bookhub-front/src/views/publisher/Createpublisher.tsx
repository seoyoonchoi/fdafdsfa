import { createPublisher } from '@/apis/publisher/publisher';
import { PublisherRequestDto } from '@/dtos/publishers/publisher.request.dto';
import React, { useState } from 'react'
import { useCookies } from 'react-cookie';

interface CreatePublisherProps{
    isOpen: boolean;
    onClose : () => void;
    onCreated : () => void;
}


function Createpublisher({isOpen, onClose, onCreated}:CreatePublisherProps

) {

  const [cookies] = useCookies(['accessToken']);
      const token = cookies.accessToken;
      const [publisherName, setPublisherName] = useState('');
      const [message, setMessage] = useState('');

      const onCreateClick = async () => {
        if(!publisherName.trim()){
          setMessage('출판사 이름을 입력해주십시오');
          return;
        }
        if(!token){
          alert('인증 토큰이 없습니다');
          return;
        }

        const dto : PublisherRequestDto = {
          publisherName
        };

        const response = await createPublisher(dto,token);
        if(response.code !== 'SU'){
          setMessage(response.message);
          return;
        }

        alert('출판사가 성공적으로 등록되었습니다.');
        onCreated();
        onClose();
        setPublisherName('');
        setMessage('');
        
      };
      if(!isOpen) return null
  return (
    <div className='modal'>
      <div><button className="modal-close-button" onClick={onClose}>x</button>
      <h2 className='modal-title'>출판사 등록</h2>
      <div><input type="text" value={publisherName} onChange={e => setPublisherName(e.target.value)} /></div>
      {message && <p className="error-message">{message}</p>}
      <div className="modal-footer">
                    <button onClick={onCreateClick} className="">등록</button>
                </div>
      
      </div></div>
  )
}

export default Createpublisher