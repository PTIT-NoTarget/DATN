package stu.careercoach;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import stu.careercoach.common.Common;
import stu.careercoach.dto.Project;

import java.time.Duration;
import java.util.List;

public class CreateProject {
    public static void main(String[] args) throws InterruptedException {
        // Prepare
        WebDriver driver = Common.init();
        driver.get("http://localhost:4200/main/projects/list");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));


        List<Project> projects = List.of(
                new Project("Project 1", "Description 1", "2023-01-01", "2023-12-31", "Manager 1"),
                new Project("Project 2", "Description 2", "2023-02-01", "2023-11-30", "Manager 2"),
                new Project("Project 3", "Description 3", "2023-03-01", "2023-10-31", "Manager 3"),
                new Project("Project 4", "Description 4", "2023-04-01", "2023-09-30", "Manager 4")
        );

        // Actions
        for (Project project : projects) {
            WebElement addNewProjectButton = wait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath("//button[span[text()=' Thêm mới dự án ']]")
            ));
            addNewProjectButton.click();

            project.fill(driver);
            WebElement addProjectButton = wait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath("//button[span[text()='Thêm mới']]")
            ));
            addProjectButton.click();
        }

        Thread.sleep(2000);

        // Assertions
        List<WebElement> projectElements = driver.findElements(By.cssSelector("projects-list > div > div"));
        System.out.println("Number of projects created: " + projectElements.size());
        System.out.println("Expected number of projects: " + projects.size());
        if (projectElements.size() != projects.size()) {
            System.out.println("Error: Number of projects created does not match expected count.");
        } else {
            System.out.println("All projects created successfully.");
        }
    }
}
