package com.test.project.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.test.project.entity.QnAEntity;


@Repository
public interface QnARepository extends JpaRepository<QnAEntity, Integer> {

}
