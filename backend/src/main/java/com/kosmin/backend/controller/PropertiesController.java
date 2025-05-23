package com.kosmin.backend.controller;

import com.kosmin.backend.model.Request;
import com.kosmin.backend.model.UpdatedYmlResponse;
import com.kosmin.backend.service.PropertyManagementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/properties-config/v1")
public class PropertiesController {

  private final PropertyManagementService propertyManagementService;

  public PropertiesController(PropertyManagementService propertyManagementService) {
    this.propertyManagementService = propertyManagementService;
  }

  @GetMapping("retrieve")
  public ResponseEntity<List<String>> getProperties() {
    return ResponseEntity.ok().body(propertyManagementService.listFiles());
  }

  @GetMapping("properties-content")
  public ResponseEntity<List<String>> getPropertiesContent(@RequestParam("fileName") String fileName) {
    return ResponseEntity.ok().body(propertyManagementService.getPropertiesContent(fileName));
  }

  @PutMapping("update")
  public ResponseEntity<UpdatedYmlResponse> updateProperties(@RequestBody Request request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(
            propertyManagementService.updateProperty(
                request.getFileName(), request.getPropertyKey(), request.getNewValue()));
  }
}
