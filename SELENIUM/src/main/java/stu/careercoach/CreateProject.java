package stu.careercoach;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import stu.careercoach.common.Common;
import stu.careercoach.dto.Project;

import java.util.List;

public class CreateProject {
    public static void main(String[] args) {
        WebDriver driver = Common.init();
        driver.get("http://localhost:4200/main/projects/list");

        List<Project> projects = List.of(
                new Project("Project 1", "Description 1", "2023-01-01", "2023-12-31", "Manager 1"),
                new Project("Project 2", "Description 2", "2023-02-01", "2023-11-30", "Manager 2"),
                new Project("Project 3", "Description 3", "2023-03-01", "2023-10-31", "Manager 3"),
                new Project("Project 4", "Description 4", "2023-04-01", "2023-09-30", "Manager 4"),
                new Project("Project 5", "Description 5", "2023-05-01", "2023-08-31", "Manager 5"),
                new Project("Project 6", "Description 6", "2023-06-01", "2023-07-31", "Manager 6"),
                new Project("Project 7", "Description 7", "2023-07-01", "2023-06-30", "Manager 7"),
                new Project("Project 8", "Description 8", "2023-08-01", "2023-05-31", "Manager 8")
        );
        for (Project project : projects) {
            WebElement addNewProjectButton = driver.findElement(By.xpath("//button[span[text()=' Thêm mới dự án ']]"));
            addNewProjectButton.click();

            project.fill(driver);

            WebElement addProjectButton = driver.findElement(By.xpath("//button[span[text()='Thêm mới']]"));
            addProjectButton.click();
        }
    }
}
