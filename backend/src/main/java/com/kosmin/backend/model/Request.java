package com.kosmin.backend.model;

import lombok.Data;

@Data
public class Request {
  private String fileName;
  private String propertyKey;
  private String newValue;
}
