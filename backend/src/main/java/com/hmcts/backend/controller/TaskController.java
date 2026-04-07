package com.hmcts.backend.controller;

import com.hmcts.backend.dto.ApiResponse;
import com.hmcts.backend.dto.TaskDTO;
import com.hmcts.backend.model.Task;
import com.hmcts.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    public ResponseEntity<ApiResponse<Task>> createTask(@Valid @RequestBody TaskDTO taskDTO) {
        Task task = taskService.createTask(taskDTO);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Task created successfully", task),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> getTaskById(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Task retrieved successfully", task)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Task>>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Tasks retrieved successfully", tasks)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Task>> updateTaskStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Task task = taskService.updateTaskStatus(id, status);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Task status updated successfully", task)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskDTO taskDTO) {
        Task task = taskService.updateTask(id, taskDTO);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Task updated successfully", task)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Task deleted successfully", null)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<Task>>> getTasksByStatus(@PathVariable String status) {
        List<Task> tasks = taskService.getTasksByStatus(status);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Tasks retrieved successfully", tasks)
        );
    }
}