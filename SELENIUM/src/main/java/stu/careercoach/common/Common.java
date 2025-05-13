package stu.careercoach.common;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class Common {
    public static WebDriver init(){
        System.setProperty("webdriver.edge.driver", "/usr/local/bin/msedgedriver");

        WebDriver driver = new EdgeDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().window().maximize();

        driver.get("http://localhost:4200/");
        Common.checkLogin(driver);
        return driver;
    }

    public static void checkLogin(WebDriver driver) {
        if (driver.getCurrentUrl() == null) {
            System.out.println("URL is null");
            return;
        }
        if (driver.getCurrentUrl().contains("/auth/login")) {
            System.out.println("Login page is displayed");

            WebElement usernameField = driver.findElement(By.cssSelector("[formControlName='username']"));
            WebElement passwordField = driver.findElement(By.cssSelector("[formControlName='password']"));

            usernameField.sendKeys("admin");
            passwordField.sendKeys("12345678");

            WebElement loginButton = driver.findElement(By.cssSelector("input[type='submit']"));
            loginButton.click();

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
            wait.until(ExpectedConditions.not(ExpectedConditions.urlContains("/auth/login")));

        }
    }
}
