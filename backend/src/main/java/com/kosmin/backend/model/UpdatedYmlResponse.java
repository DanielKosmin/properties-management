package com.kosmin.backend.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class UpdatedYmlResponse {
  private String currentKey;
  private String previousValue;
  private String newValue;
  private Status status;
}
