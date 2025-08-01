
import { StockResponseDto } from '@/dtos/stock/Stock.response.dto';

interface StockDetailProps {
    isOpen: boolean;
    onClose : () => void;
    stockDetail : StockResponseDto;
    
}

function PolicyDetail({isOpen, onClose, stockDetail}:StockDetailProps) {
  if(!isOpen) return null;

  return (
    <div className="modal-overlay">
        <div className="">
            <button className="modal-close-button" onClick={onClose}>x</button>
            <h2 className="modal-title">재고 상세 조회</h2>
            <table className="detail-table">
                <tbody>
                    <tr>
                        <th>책 제목</th>
                        <td>{stockDetail.bookTitle}</td>
                    </tr>
                    <tr>
                        <th>지점</th>
                        <td>{stockDetail.branchName}</td>
                    </tr>
                    
                
                    <tr>
                        <th>재고량</th>
                        <td>{stockDetail.amount}</td>
                    </tr>
                    

                </tbody>
                
            </table>
            
        </div>
    </div>
  );
};

export default PolicyDetail;