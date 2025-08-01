package com.example.bookhub_back.service.stock;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessage;
import com.example.bookhub_back.common.constants.ResponseMessageKorean;
import com.example.bookhub_back.common.enums.StockActionType;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.alert.request.AlertCreateRequestDto;
import com.example.bookhub_back.dto.policy.response.PolicyListResponseDto;
import com.example.bookhub_back.dto.stock.request.StockUpdateRequestDto;
import com.example.bookhub_back.dto.stock.response.StockResponseDto;
import com.example.bookhub_back.entity.*;
import com.example.bookhub_back.repository.AuthorityRepository;
import com.example.bookhub_back.repository.BookRepository;
import com.example.bookhub_back.repository.BranchRepository;
import com.example.bookhub_back.repository.EmployeeRepository;
import com.example.bookhub_back.repository.stock.StockLogRepository;
import com.example.bookhub_back.repository.stock.StockRepository;
import com.example.bookhub_back.security.auth.EmployeePrincipal;
import com.example.bookhub_back.service.alert.AlertService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService{

    private final StockRepository stockRepository;
    private final StockLogRepository stockLogRepository;
    private final AlertService alertService;
    private final AuthorityRepository authorityRepository;
    private final BookRepository bookRepository;
    private final BranchRepository branchRepository;
    private final EmployeeRepository employeeRepository;


    @Override
    public ResponseDto<Void> updateStock(

            EmployeePrincipal employeePrincipal, Long stockId, StockUpdateRequestDto dto) {


        StockActionType actionType = StockActionType.valueOf(dto.getType().toUpperCase());
        Long updatedAmount;

        Stock stock;

        if(stockId != null){
            stock = stockRepository.findById(stockId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 재고 아이디가 존재하지 않습니다"));
        }else{
            Book book = bookRepository.findById(dto.getBookIsbn())
                    .orElseThrow(() -> new IllegalArgumentException("도서가 존재하지 않습니다."));

            Branch branch = branchRepository.findById(employeePrincipal.getBranchId())
                    .orElseThrow(() -> new IllegalArgumentException("지점이 존재하지 않습니다."));

            Employee employee = employeeRepository.findById(employeePrincipal.getEmployeeId())
                    .orElseThrow(() -> new IllegalArgumentException("로그인한 사용자가 존재하지 않습니다"));

            stock = stockRepository.findByBookIsbnAndBranchId(book, branch)
                    .orElseGet(() -> stockRepository.save(
                            Stock.builder()
                                    .bookIsbn(book)
                                    .branchId(branch)
                                    .bookAmount(0L)
                                    .build()
                    ));
        }


        switch (actionType) {
            case IN -> updatedAmount = stock.getBookAmount() + dto.getAmount();
            case OUT, LOSS -> {
                if(stock.getBookAmount() < dto.getAmount()){
                    throw new IllegalArgumentException("재고부족");
                }
                updatedAmount = stock.getBookAmount() - dto.getAmount();
            }
            default -> throw new IllegalArgumentException("잘못된 타입");

        }
        stock.setBookAmount(updatedAmount);
        stockRepository.save(stock);

        StockLog log = StockLog.builder()
                .stockActionType(StockActionType.valueOf(dto.getType()))
                .employee(employeeRepository.findById(employeePrincipal.getEmployeeId())
                        .orElseThrow(() -> new IllegalArgumentException("로그인한 사용자가 존재하지 않습니다")))
                .bookIsbn(bookRepository.findById(dto.getBookIsbn()).orElseThrow(()-> new IllegalArgumentException((ResponseMessageKorean.RESOURCE_NOT_FOUND))))
                .branchId(branchRepository.findById(employeePrincipal.getBranchId()).orElseThrow(()-> new IllegalArgumentException((ResponseMessageKorean.RESOURCE_NOT_FOUND))))
                .amount(dto.getAmount())
                .bookAmount(updatedAmount)
                .description(dto.getDescription())
                .build();

        stockLogRepository.save(log);
        if ((actionType == StockActionType.OUT || actionType == StockActionType.LOSS) && updatedAmount <= 5) {
            Authority managerAuthority = authorityRepository.findByAuthorityName("MANAGER")
                    .orElseThrow(() -> new IllegalArgumentException(ResponseMessageKorean.USER_NOT_FOUND));

            final Stock finalStock = stock;

            String alertType = (updatedAmount == 0) ? "STOCK_OUT" : "STOCK_LOW";
            String message = "[" + stock.getBookIsbn().getBookTitle() + "] 도서의 재고가 "
                    + (updatedAmount == 0 ? "모두 소진되었습니다." : "부족합니다 (남은 수량: " + updatedAmount + "권)");

            employeeRepository.findAll().stream()
                    .filter(emp -> emp.getAuthorityId().equals(managerAuthority) && emp.getBranchId().equals(finalStock.getBranchId()))
                    .forEach(manager -> {
                        AlertCreateRequestDto alertDto = AlertCreateRequestDto.builder()
                                .employeeId(manager.getEmployeeId())
                                .alertType(alertType)
                                .message(message)
                                .alertTargetTable("STOCKS")
                                .targetPk(stock.getStockId())
                                .targetIsbn(String.valueOf(stock.getBookIsbn()))
                                .build();
                        alertService.createAlert(alertDto);
                    });
        }


        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseDto<PageResponseDto<StockResponseDto>> getFilteredStocks(int page, int size, Long branchId, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Stock> result = stockRepository.findFiltered(keyword != null && keyword.isBlank() ?
                null : keyword,branchId,pageable);

        List<StockResponseDto> content = result.getContent().stream()
                .map(stock -> StockResponseDto.builder()
                        .stockId(stock.getStockId())
                        .branchId(stock.getBranchId().getBranchId())
                                .bookIsbn(stock.getBookIsbn().getIsbn())
                                .branchName(stock.getBranchId().getBranchName())
                                .bookTitle(stock.getBookIsbn().getBookTitle())
                                .amount(stock.getBookAmount())
                                .build())
                .collect(Collectors.toList());

        PageResponseDto<StockResponseDto> pageDto = PageResponseDto.of(content,
                result.getTotalElements(),
                result.getTotalPages(),
                result.getNumber());

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, pageDto);
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseDto<StockResponseDto> getStockById(Long stockId) {
        StockResponseDto dto = null;
        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(()-> new EntityNotFoundException(ResponseCode.NO_EXIST_ID + stockId));
        dto = StockResponseDto.builder()
                .stockId(stock.getStockId())
                .bookIsbn(stock.getBookIsbn().getIsbn())
                .branchId(stock.getBranchId().getBranchId())
                .bookAmount(stock.getBookAmount())
                .build();

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, dto);


    }
}
