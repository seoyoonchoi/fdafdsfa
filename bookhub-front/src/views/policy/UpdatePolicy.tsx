

import { PolicyType } from '@/apis/enums/PolicyType';
import { updatePolicy } from '@/apis/policies/PolicyAdmin';
import { PolicyUpdateRequestDto } from '@/dtos/policy/Policy.request.dto';
import { PolicyDetailResponseDto } from '@/dtos/policy/Policy.response.dto';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';

interface UpdatePolicyProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    policyDetail: PolicyDetailResponseDto;
    policyId: number;
}

function UpdatePolicy({ isOpen, onClose, onUpdate, policyDetail, policyId }: UpdatePolicyProps) {

    const [cookies] = useCookies(['accessToken']);
    const token = cookies.accessToken;
    const [policyTitle, setPolicyTitle] = useState('');
    const [policyDescription, setPolicyDescription] = useState('');
    const [policyType, setPolicyType] = useState<PolicyType>(PolicyType.BOOK_DISCOUNT);
    const [totalPriceAchieve, setTotalPriceAchieve] = useState<number | undefined>(undefined);
    const [discountPercent, setDiscountPercent] = useState<number>(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (policyDetail) {
            setPolicyTitle(policyDetail.policyTitle);
            setPolicyDescription(policyDetail.policyDescription || '');
            setPolicyType(policyDetail.policyType);
            setTotalPriceAchieve(policyDetail.totalPriceAchieve);
            setDiscountPercent(policyDetail.discountPercent);
            setStartDate(policyDetail.startDate);
            setEndDate(policyDetail.endDate);
            setMessage('');
        }
    }, [policyDetail]);

    const onUpdateClick = async () => {
        if (!policyTitle.trim()) {
            setMessage('제목을 입력하세요');
            return;
        }
        if (discountPercent <= 0) {
            setMessage('할인율을 입력하세요');
            return;
        }
        if (!token) {
            alert('인증 토큰이 없습니다.');
            return;
        }

        const dto: PolicyUpdateRequestDto = {
            policyDescription,
            totalPriceAchieve,
            discountPercent,
            startDate,
            endDate
        };

        try{
            const response = await updatePolicy(policyId,dto,token);
            if(response.code !=='SU'){
            setMessage(response.message || '수정 실패');
            return;
            }
            alert('정책이 성공적으로 수정되었습니다');
            onUpdate();
            onClose();
        }catch(err){
            console.error('정책 수정 중 예외',err);
            setMessage('정책 수정 중 예외 발생');
        }
    };

    if(!isOpen) return null;


    return (
        <div className="modal-overlay">
            <div className="policy-detail-modal">
                <button className="modal-close-button" onClick={onClose}>x</button>
                <h2 className="modal-title">정책 수정</h2>
                <div className="form-group">
                    <label>정책 타입</label>
                    <select value={policyType} onChange={e=>setPolicyType(e.target.value as PolicyType)}>
                        <option value={PolicyType.BOOK_DISCOUNT}>도서 할인</option>
                        <option value={PolicyType.CATEGORY_DISCOUNT}>카테고리 할인</option>
                        <option value={PolicyType.TOTAL_PRICE_DISCOUNT}>총 금액 할인</option>
                    </select>
                </div>
                <div className="form-group two-cols">
                    <div>
                        <label>시작일</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}/>
                    </div>
                    <div>
                        <label>종료일</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}/>
                    </div>
                </div>

                <div className="form-group">
                    <label>제목</label>
                    <input type="text" placeholder="정책 제목을 입력하세요" value={policyTitle} 
                    onChange={e => setPolicyTitle(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>설명</label>
                    <textarea placeholder="정책 설명을 입력하세요" value={policyDescription} 
                    onChange={e => setPolicyDescription(e.target.value)}/>
                </div>

                <div className="form-group two-cols">
                    <div>
                        <label>총 금액</label>
                        <input type="number" placeholder="총 금액" value={totalPriceAchieve ?? ''} 
                        onChange={e =>setTotalPriceAchieve(e.target.value ? Number(e.target.value) : undefined)} />
                    </div>

                    <div>
                        <label>할인율(%)</label>
                        <input type="number" placeholder="할인율(%)" value={discountPercent} 
                        onChange={e =>setDiscountPercent(Number(e.target.value))} />
                    </div>
                </div>

                {message && <p className="error-message">{message}</p>}
                <div className="modal-footer">
                    <button onClick={onUpdateClick} className="">수정</button>
                </div>

            </div>

        </div>
    )
}

export default UpdatePolicy