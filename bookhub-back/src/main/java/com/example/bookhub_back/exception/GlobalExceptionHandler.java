package com.example.bookhub_back.exception;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessage;
import com.example.bookhub_back.dto.ResponseDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({ IllegalArgumentException.class, IllegalStateException.class })
    public ResponseEntity<ResponseDto<?>> handleBadRequest(RuntimeException e) {
        return logAndRespond(ResponseCode.INVALID_INPUT, ResponseMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST, e);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseDto<?>> handleValidationException(MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult().getFieldError() != null
            ? e.getBindingResult().getFieldError().getDefaultMessage()
            : ResponseMessage.VALIDATION_FAIL;
        return logAndRespond(ResponseCode.VALIDATION_FAIL, errorMessage, HttpStatus.BAD_REQUEST, e);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ResponseDto<?>> handleAccessDenied(AccessDeniedException e) {
        return logAndRespond(ResponseCode.NO_PERMISSION, ResponseMessage.NO_PERMISSION, HttpStatus.FORBIDDEN, e);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ResponseDto<?>> handleNotFound(EntityNotFoundException e) {
        return logAndRespond(ResponseCode.RESOURCE_NOT_FOUND, ResponseMessage.RESOURCE_NOT_FOUND, HttpStatus.NOT_FOUND, e);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ResponseDto<?>> handleDataIntegrity(DataIntegrityViolationException e) {
        return logAndRespond(ResponseCode.DATA_INTEGRITY_VIOLATION, ResponseMessage.DATA_INTEGRITY_VIOLATION, HttpStatus.CONFLICT, e);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDto<?>> handleGeneral(Exception e) {
        return logAndRespond(ResponseCode.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, e);
    }

    private ResponseEntity<ResponseDto<?>> logAndRespond(String code, String message, HttpStatus status, Exception e) {
        e.printStackTrace();
        return ResponseDto.failWithStatus(code, message, status);

    }
}