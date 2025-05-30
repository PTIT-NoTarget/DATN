package stu.careercoach.dto;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class Task {
    private String taskName;
    private String taskDescription;
    private String taskFollower;
    private String taskAssignee;

    public void fill(WebDriver driver) throws InterruptedException {
        WebElement taskNameField = driver.findElement(By.cssSelector("[formControlName='title']"));
        WebElement taskDescriptionField = driver.findElement(By.cssSelector("quill-editor[formControlName='description'] div[contenteditable='true']"));
        WebElement taskFollowerField = driver.findElement(By.cssSelector("issue-reporter-select"));
        WebElement taskAssigneeField = driver.findElement(By.cssSelector("issue-assignees-select"));

        taskNameField.sendKeys(this.taskName);
        taskDescriptionField.sendKeys(this.taskDescription);
        taskFollowerField.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        List<WebElement> followerOptions = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.cssSelector("div.cdk-overlay-container nz-option-item")
        ));
        if (!followerOptions.isEmpty()) {
            followerOptions.getFirst().click();
        }

        Thread.sleep(1000);

        taskAssigneeField.click();
        List<WebElement> assigneeOptions = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.cssSelector("div.cdk-overlay-container nz-option-item")
        ));
        if (!assigneeOptions.isEmpty()) {
            for (WebElement option : assigneeOptions) {
                option.click();
            }
            Thread.sleep(1000);
            taskAssigneeField.click();
            taskAssigneeField.click();
        }
    }

    public Task() {
    }

    public Task(String taskName, String taskDescription, String taskFollower, String taskAssignee) {
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.taskFollower = taskFollower;
        this.taskAssignee = taskAssignee;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getTaskDescription() {
        return taskDescription;
    }

    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }

    public String getTaskFollower() {
        return taskFollower;
    }

    public void setTaskFollower(String taskFollower) {
        this.taskFollower = taskFollower;
    }

    public String getTaskAssignee() {
        return taskAssignee;
    }

    public void setTaskAssignee(String taskAssignee) {
        this.taskAssignee = taskAssignee;
    }
}
