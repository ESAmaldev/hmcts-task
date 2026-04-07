package com.hmcts.backend.dto;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
}