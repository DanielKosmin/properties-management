package com.kosmin.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.kosmin.backend.model.Status;
import com.kosmin.backend.model.UpdatedYmlResponse;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.lib.Repository;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.stream.Collectors;

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

  public List<String> getPropertiesContent(String fileName) {
    return Optional.ofNullable(git)
        .map(Git::getRepository)
        .map(Repository::getDirectory)
        .map(File::getParentFile)
        .map(File::listFiles)
        .map(Arrays::asList)
        .orElse(Collections.emptyList())
        .stream()
        .filter(file -> file.getName().equals(fileName))
        .findFirst()
        .map(
            fileContent -> {
              try (InputStream inputStream = new FileInputStream(fileContent)) {
                Properties properties = new Properties();
                properties.load(inputStream);
                return properties.entrySet().stream()
                    .map(entry -> entry.getKey() + "=" + entry.getValue())
                    .collect(Collectors.toList());
              } catch (IOException e) {
                return new ArrayList<String>();
              }
            })
        .orElse(List.of());
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
      repoManagementService.refreshRepo();

      return response.newValue(newValue).status(Status.UPDATED_SUCCESSFULLY).build();
    } catch (Exception ignored) {
      return response.status(Status.FAILED_TO_UPDATE).build();
    }
  }
}
