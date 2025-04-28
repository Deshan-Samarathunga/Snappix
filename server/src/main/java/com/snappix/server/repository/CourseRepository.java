package com.snappix.server.repository;

import com.snappix.server.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByCommunity(String community);
}
