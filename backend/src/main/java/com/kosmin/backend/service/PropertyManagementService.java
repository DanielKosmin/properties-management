package com.kosmin.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.kosmin.backend.model.Status;
import com.kosmin.backend.model.UpdatedYmlResponse;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jgit.api.Git;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class PropertyManagementService {

  private final Git git;
  private final ObjectMapper objectMapper;
  private final RepoManagementService repoManagementService;

  public PropertyManagementService(Git git, RepoManagementService repoManagementService) {
    this.git = git;
    this.objectMapper = new ObjectMapper(new YAMLFactory());
    this.repoManagementService = repoManagementService;
  }

  public List<String> listFiles() {
    List<String> files = new ArrayList<>();
    File gitDir = git.getRepository().getDirectory().getParentFile();
    Optional.ofNullable(gitDir.listFiles())
        .map(Arrays::stream)
        .ifPresent(stream -> stream.map(File::getName).forEach(files::add));
    return files;
  }

  public UpdatedYmlResponse updateProperty(String fileName, String key, String newValue) {
    UpdatedYmlResponse.UpdatedYmlResponseBuilder response =
        UpdatedYmlResponse.builder().currentKey(key);
    File gitDir = git.getRepository().getDirectory().getParentFile();
    File targetFile = new File(gitDir, fileName);

    try {
      Map<String, Object> propertyValue =
          objectMapper.readValue(targetFile, new TypeReference<>() {});
      Object oldValue = propertyValue.get(key);
      response.previousValue(oldValue != null ? oldValue.toString() : "");

      propertyValue.put(key, newValue);
      objectMapper.writeValue(targetFile, propertyValue);
      repoManagementService.commitAndPushPropertyUpdate(
          String.format("Update %s's Key: %s with value: %s", fileName, key, newValue));

      return response.newValue(newValue).status(Status.UPDATED_SUCCESSFULLY).build();
    } catch (Exception ignored) {
      return response.status(Status.FAILED_TO_UPDATE).build();
    }
  }
}
