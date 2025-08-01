import { PolicyType } from '@/apis/enums/PolicyType';
import { PolicyDetailResponseDto } from '@/dtos/policy/Policy.response.dto';

interface PolicyDetailProps {
    isOpen: boolean;
    onClose : () => void;
    policyDetail : PolicyDetailResponseDto;
    
}

function PolicyDetail({isOpen, onClose, policyDetail}:PolicyDetailProps) {
  if(!isOpen) return null;

  return (
    <div className="modal-overlay">
        <div className="policy-detail-modal">
            <button className="modal-close-button" onClick={onClose}>x</button>
            <h2 className="modal-title">정책 상세 조회</h2>
            <table className="detail-table">
                <tbody>
                    <tr>
                        <th>제목</th>
                        <td>{policyDetail.policyTitle}</td>
                    </tr>
                    <tr>
                        <th>기간</th>
                        <td>{policyDetail.startDate}-{policyDetail.endDate}</td>
                    </tr>
                    
                        {policyDetail.policyType == PolicyType.TOTAL_PRICE_DISCOUNT && (
                            <tr>
                            <th>기준금액</th>
                            <td>{policyDetail.totalPriceAchieve.toLocaleString()}원</td>
                            </tr>
                        )}
                        
                    
                    <tr>
                        <th>할인율</th>
                        <td>{policyDetail.discountPercent}</td>
                    </tr>
                    <tr>
                        <th>타입</th>
                        <td>{policyDetail.policyType}</td>
                    </tr>
                    <tr>
                        <th>설명</th>
                        <td>{policyDetail.policyDescription || '-'}</td>
                    </tr>

                </tbody>
                
            </table>
            
        </div>
    </div>
  );
};

export default PolicyDetail;