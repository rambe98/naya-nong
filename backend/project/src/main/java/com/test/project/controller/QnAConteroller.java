package com.test.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.test.project.dto.QnADTO;
import com.test.project.service.QnAService;

@RestController
@RequestMapping("/qna")
public class QnAConteroller {

	@Autowired
	private QnAService service;

	@GetMapping
	public ResponseEntity<?> showAllQna() {
		List<QnADTO> products = service.showAllQna();
		return ResponseEntity.ok(products);
	}// showAllusers end

	@GetMapping("/{qnaNum}")
	public ResponseEntity<?> showQna(@PathVariable("qnaNum") int qnaNum) {
		QnADTO qna = service.showQna(qnaNum);
		return ResponseEntity.ok(qna);
	}// showAllusers end

	@PostMapping
	public ResponseEntity<?> addQna(@RequestBody QnADTO dto) {
		QnADTO addqna = service.addQna(dto);
		return ResponseEntity.ok().body(addqna); 
	}// adduser end

}// class end
