package stu.careercoach;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import stu.careercoach.common.Common;

import java.time.Duration;
import java.util.List;
import java.util.Random;

public class AddUserToProject {
    public static void main(String[] args) throws InterruptedException {
        // Prepare
        WebDriver driver = Common.init();
        driver.get("http://localhost:4200/main/projects/list");

        List<WebElement> projects = driver.findElements(By.cssSelector("projects-list > div > div"));
        if(projects.isEmpty()) {
            System.out.println("No projects found");
            return;
        }

        // Action
        WebElement project = projects.getFirst();
        WebElement addUserButton = project.findElement(By.cssSelector("a"));
        addUserButton.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement overlayContainer = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("div.cdk-overlay-container")));

        WebElement manageMembersItem = overlayContainer.findElement(By.xpath(".//li[contains(@class, 'ant-dropdown-menu-item') and text()='Quản lý thành viên']"));
        manageMembersItem.click();

        WebElement userField = driver.findElement(By.cssSelector("nz-select input"));
        userField.sendKeys("Nguyễn Văn A");
        List<WebElement> options = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.cssSelector("div.cdk-overlay-container nz-option-item")
        ));
        if (options.isEmpty()) {
            System.out.println("No options found");
            return;
        }
        options.getFirst().click();
        WebElement addUserButtonInModal = driver.findElement(By.xpath("//button[span[text()='Thêm thành viên']]"));
        addUserButtonInModal.click();

        Thread.sleep(2000);

        // Assertions
        WebElement projectsMembersAdd = driver.findElement(By.cssSelector("projects-members-add"));
        List<WebElement> userNameElements = projectsMembersAdd.findElements(By.cssSelector("span.user-name"));

        boolean userFound = false;
        for (WebElement member : userNameElements) {
            if (member.getText().contains("Nguyễn Văn A")) {
                userFound = true;
                break;
            }
        }
        System.out.println("User found in members list: " + userFound);
    }
}
