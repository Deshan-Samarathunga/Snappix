package com.snappix.server.service;

import com.snappix.server.model.Course;
import com.snappix.server.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(String id) {
        return courseRepository.findById(id);
    }

    public Optional<Course> updateCourse(String id, Course updatedCourse) {
        return courseRepository.findById(id)
                .map(course -> {
                    course.setTitle(updatedCourse.getTitle());
                    course.setDescription(updatedCourse.getDescription());
                    course.setInstructorEmail(updatedCourse.getInstructorEmail());
                    course.setInstructorName(updatedCourse.getInstructorName());
                    course.setMediaUrls(updatedCourse.getMediaUrls());
                    return courseRepository.save(course);
                });
    }

    public boolean deleteCourse(String id) {
        return courseRepository.findById(id)
                .map(course -> {
                    courseRepository.delete(course);
                    return true;
                }).orElse(false);
    }
}
