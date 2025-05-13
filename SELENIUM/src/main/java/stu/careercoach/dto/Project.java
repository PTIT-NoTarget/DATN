package stu.careercoach.dto;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;
import java.util.Random;

public class Project {
    private String projectName;
    private String projectDescription;
    private String projectStartDate;
    private String projectEndDate;
    private String projectManager;

    public void fill(WebDriver driver) {
        WebElement projectNameField = driver.findElement(By.cssSelector("[formControlName='name']"));
        WebElement projectDescriptionField = driver.findElement(By.cssSelector("[formControlName='description']"));
        WebElement projectStartDateField = driver.findElement(By.cssSelector("[formControlName='start_date'] input"));
        WebElement projectEndDateField = driver.findElement(By.cssSelector("[formControlName='end_date'] input"));
        WebElement projectManagerField = driver.findElement(By.cssSelector("[formControlName='manager_id'] input"));

        projectNameField.sendKeys(this.projectName);
        projectDescriptionField.sendKeys(this.projectDescription);
        projectStartDateField.sendKeys(this.projectStartDate);
        projectEndDateField.sendKeys(this.projectEndDate);
        projectManagerField.sendKeys(this.projectManager);

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        List<WebElement> options = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.cssSelector("div.cdk-overlay-container nz-option-item")
        ));
        if (!options.isEmpty()) {
            int randomIndex = new Random().nextInt(options.size());
            options.get(randomIndex).click();
        }
    }

    public Project(String projectName, String projectDescription, String projectStartDate, String projectEndDate, String projectManager) {
        this.projectName = projectName;
        this.projectDescription = projectDescription;
        this.projectStartDate = projectStartDate;
        this.projectEndDate = projectEndDate;
        this.projectManager = projectManager;
    }

    public Project() {
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectDescription() {
        return projectDescription;
    }

    public void setProjectDescription(String projectDescription) {
        this.projectDescription = projectDescription;
    }

    public String getProjectStartDate() {
        return projectStartDate;
    }

    public void setProjectStartDate(String projectStartDate) {
        this.projectStartDate = projectStartDate;
    }

    public String getProjectEndDate() {
        return projectEndDate;
    }

    public void setProjectEndDate(String projectEndDate) {
        this.projectEndDate = projectEndDate;
    }

    public String getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(String projectManager) {
        this.projectManager = projectManager;
    }
}
