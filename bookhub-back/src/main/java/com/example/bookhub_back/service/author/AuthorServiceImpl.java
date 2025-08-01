package com.example.bookhub_back.service.author;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessageKorean;
import com.example.bookhub_back.dto.PageResponseDto;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.author.request.AuthorCreateRequestDto;
import com.example.bookhub_back.dto.author.request.AuthorRequestDto;
import com.example.bookhub_back.dto.author.response.AuthorResponseDto;
import com.example.bookhub_back.entity.Author;
import com.example.bookhub_back.repository.AuthorRepository;
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
public class AuthorServiceImpl implements AuthorService {
    private final AuthorRepository authorRepository;

    @Override
    public ResponseDto<Void> checkDuplicateAuthorEmail(String authorEmail) {
        if (authorRepository.existsByAuthorEmail(authorEmail)) {
            System.out.println("durlfwsdowfowffwfwfh");
            return ResponseDto.fail(ResponseCode.DUPLICATED_EMAIL, ResponseMessageKorean.DUPLICATED_EMAIL);
        }

        return ResponseDto.success(ResponseCode.SUCCESS, "사용 가능한 이메일입니다.");
    }

    @Override
    @Transactional
    public ResponseDto<List<Void>> createAuthor(AuthorCreateRequestDto dto) {
        List<AuthorRequestDto> requestDtos = dto.getAuthors();
        List<Author> authors = requestDtos.stream()
            .map(requestDto -> Author.builder()
                .authorName(requestDto.getAuthorName())
                .authorEmail(requestDto.getAuthorEmail())
                .build())
            .collect(Collectors.toList());

        authorRepository.saveAll(authors);

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS);
    }

    @Override
    public ResponseDto<PageResponseDto<AuthorResponseDto>> getAllAuthorsByName(int page, int size, String authorName) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Author> authors = null;
        List<AuthorResponseDto> responseDtos = null;

        authors = authorRepository.searchAuthor(authorName, pageable)
            .orElseThrow(() -> new IllegalArgumentException("작가가 찾을 수 없습니다."));

        responseDtos = authors.stream()
            .map(author -> AuthorResponseDto.builder()
                .authorId(author.getAuthorId())
                .authorName(author.getAuthorName())
                .authorEmail(author.getAuthorEmail())
                .build())
            .collect(Collectors.toList());

        PageResponseDto<AuthorResponseDto> pageResponseDto = PageResponseDto.of(
            responseDtos,
            authors.getTotalElements(),
            authors.getTotalPages(),
            authors.getNumber()
        );

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, pageResponseDto);
    }

    @Override
    @Transactional
    public ResponseDto<Void> updateAuthor(Long authorId, AuthorRequestDto dto) {
        Author author = authorRepository.findById(authorId)
            .orElseThrow(() -> new IllegalArgumentException("작가를 찾을 수 없습니다."));

        author.setAuthorName(dto.getAuthorName());
        author.setAuthorEmail(dto.getAuthorEmail());

        authorRepository.save(author);

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS);
    }

    @Override
    @Transactional
    public ResponseDto<Void> deleteAuthor(Long authorId) {
        Author author = authorRepository.findById(authorId)
            .orElseThrow(() -> new IllegalArgumentException("작가를 찾을 수 없습니다."));

        authorRepository.delete(author);

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS);
    }
}
