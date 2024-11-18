package com.project.web.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.dto.ResponseDTO;
import com.project.dto.WebDTO;
import com.project.service.WebService;
import com.project.web.model.WebEntity;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("web")
@AllArgsConstructor
public class WebController {
	
	@Autowired
	private WebService service;
	
	
	public ResponseEntity<?> webList(){
		List<WebEntity> entities = service.findAll();
		List<WebDTO> dtos = entities.stream().map(WebDTO :: new).collect(Collectors.toList());
		ResponseDTO<WebDTO> response = ResponseDTO.<WebDTO>builder().data(dtos).build();
		return ResponseEntity.ok().body(response);
	}
	

}
