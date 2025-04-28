package com.snappix.server.controller;

import com.snappix.server.model.Course;
import com.snappix.server.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepo;

    // Create a new course
    @PostMapping
    public ResponseEntity<Course> addCourse(@RequestBody Course course) {
        Course saved = courseRepo.save(course);
        return ResponseEntity.ok(saved);
    }

    // Get all courses for a community
    @GetMapping("/{communityName}")
    public ResponseEntity<List<Course>> getCoursesByCommunity(@PathVariable String communityName) {
        List<Course> courses = courseRepo.findByCommunity(communityName);
        return ResponseEntity.ok(courses);
    }
}
