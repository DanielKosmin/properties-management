package com.kosmin.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/properties-config/v1")
public class HealthController {

  @GetMapping
  public String health() {
    return "OK";
  }
}
