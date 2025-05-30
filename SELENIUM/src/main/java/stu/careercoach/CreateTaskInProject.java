package stu.careercoach;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import stu.careercoach.common.Common;
import stu.careercoach.dto.Task;

import java.time.Duration;
import java.util.List;

public class CreateTaskInProject {
    public static void main(String[] args) throws InterruptedException {
        // Prepare
        WebDriver driver = Common.init();
        driver.get("http://localhost:4200/main/projects/list");

        // Action
        List<WebElement> projects = driver.findElements(By.cssSelector("projects-list > div > div"));

        if(projects.isEmpty()) {
            System.out.println("No projects found");
            return;
        }
        projects.getFirst().click();

        List<Task> tasks = List.of(
                new Task("Task 1", "Description 1", "Follower 1", ""),
                new Task("Task 2", "Description 2", "Follower 2", ""),
                new Task("Task 3", "Description 3", "Follower 3", ""),
                new Task("Task 4", "Description 4", "Follower 4", ""),
                new Task("Task 5", "Description 5", "Follower 5", "")
        );

        for (Task task : tasks) {
            WebElement addNewTaskButton = driver.findElement(By.xpath("//button[span[text()=' Thêm mới công việc ']]"));
            addNewTaskButton.click();
            task.fill(driver);
            WebElement addTaskButton = driver.findElement(By.xpath("//button[span[text()=' Tạo công việc ']]"));
            addTaskButton.click();
        }
        Thread.sleep(2000);
        // Assertion

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        List<WebElement> boardColumns = driver.findElements(By.cssSelector("board-dnd > div > div"));
        WebElement backlogColumn = boardColumns.getFirst();

        List<WebElement> backlogTasks = backlogColumn.findElements(By.cssSelector("issue-card"));
        System.out.println("Number of tasks created: " + backlogTasks.size());
        System.out.println("Expected number of tasks: " + tasks.size());

        if (backlogTasks.size() != tasks.size()) {
            System.out.println("Error: Number of tasks created does not match expected count");
        } else {
            boolean allTasksFound = true;
            for (Task expectedTask : tasks) {
                boolean taskFound = false;
                for (WebElement actualTask : backlogTasks) {
                    if (actualTask.getText().contains(expectedTask.getTaskName())) {
                        taskFound = true;
                        break;
                    }
                }
                if (!taskFound) {
                    System.out.println("Error: Task '" + expectedTask.getTaskName() + "' not found");
                    allTasksFound = false;
                }
            }
            if (allTasksFound) {
                System.out.println("All tasks created successfully and found in Backlog");
            }
        }
    }
}
