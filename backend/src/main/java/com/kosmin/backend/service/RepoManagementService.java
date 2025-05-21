package com.kosmin.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.PullResult;
import org.eclipse.jgit.transport.CredentialsProvider;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RepoManagementService {

  private final Git git;
  private final CredentialsProvider credentialsProvider;

  public RepoManagementService(Git git, CredentialsProvider credentialsProvider) {
    this.git = git;
    this.credentialsProvider = credentialsProvider;
  }

  public void commitAndPushPropertyUpdate(String commitMessage) {
    try {
      git.add().addFilepattern(".").call();
      git.commit().setMessage(commitMessage).call();
      git.push().setCredentialsProvider(credentialsProvider).call();
      log.info("Commit and Push property updated");
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }

  public void refreshRepo() {
    try {
      PullResult pullResult = git.pull().setCredentialsProvider(credentialsProvider).call();
      boolean result = pullResult.isSuccessful();
      log.info(result ? "Pull Successful" : "Pull Failed");
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }
}
