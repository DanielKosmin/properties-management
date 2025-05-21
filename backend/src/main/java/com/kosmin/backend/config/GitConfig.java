package com.kosmin.backend.config;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.transport.CredentialsProvider;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
public class GitConfig {

  private static final String REPO_URI = "https://github.com/DanielKosmin/application-configs";
  private static final String LOCAL_PATH = "/tmp/configs";

  @Value("${spring.cloud.config.server.git.token}")
  private String gitToken;

  @Bean
  public CredentialsProvider credentialsProvider() {
    return new UsernamePasswordCredentialsProvider("DanielKosmin", gitToken);
  }

  @Bean
  public Git gitRepo(CredentialsProvider credentialsProvider) throws GitAPIException {
    File localDir = new File(LOCAL_PATH);

    if (localDir.exists()) {
      try {
        return Git.open(localDir);
      } catch (Exception e) {
        deleteDirectory(localDir);
      }
    }

    return Git.cloneRepository()
        .setURI(REPO_URI)
        .setDirectory(localDir)
        .setCredentialsProvider(credentialsProvider)
        .setCloneAllBranches(true)
        .call();
  }

  private void deleteDirectory(File dir) {
    File[] files = dir.listFiles();
    if (files != null) {
      for (File f : files) {
        deleteDirectory(f);
      }
    }
    dir.delete();
  }
}
