package stu.careercoach;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import stu.careercoach.common.Common;

import java.time.Duration;
import java.util.List;

public class ChangeTaskStatus {
    public static void main(String[] args) throws InterruptedException {
        // Prepare
        WebDriver driver = Common.init();
        driver.get("http://localhost:4200/main/projects/list");

        // Action
        List<WebElement> projects = driver.findElements(By.cssSelector("projects-list > div > div"));

        if (projects.isEmpty()) {
            System.out.println("No projects found");
            return;
        }
        projects.getFirst().click();
        List<WebElement> boards = driver.findElements(By.cssSelector("board-dnd > div > div"));

        WebElement backlog = boards.get(0);
        List<WebElement> backlogTasks = backlog.findElements(By.cssSelector("issue-card"));

        WebElement inProgress = boards.get(2);
        String inProgressTaskName = backlogTasks.getFirst().getText();
        dragAndDrop(driver, backlogTasks.getFirst(), inProgress);

        WebElement cancel = boards.get(5);
        String cancelTaskName = backlogTasks.get(1).getText();
        dragAndDropWithScroll(driver, backlogTasks.get(1), cancel);

        // Assertion
        System.out.println("First task moved to In Progress: " + inProgressTaskName);
        System.out.println("Second task moved to Cancel: " + cancelTaskName);
        Thread.sleep(2000);
        WebElement inProgressColumn = boards.get(2);
        List<WebElement> inProgressTasks = inProgressColumn.findElements(By.cssSelector("issue-card"));
        boolean firstTaskMoved = false;
        for (WebElement task : inProgressTasks) {
            if (task.getText().contains(inProgressTaskName)) {
                firstTaskMoved = true;
                break;
            }
        }
        System.out.println("First task moved to In Progress: " + firstTaskMoved);

        WebElement cancelColumn = boards.get(5);
        List<WebElement> cancelTasks = cancelColumn.findElements(By.cssSelector("issue-card"));
        boolean secondTaskMoved = false;
        for (WebElement task : cancelTasks) {
            if (task.getText().contains(cancelTaskName)) {
                secondTaskMoved = true;
                break;
            }
        }
        System.out.println("Second task moved to Cancel: " + secondTaskMoved);

        if (firstTaskMoved && secondTaskMoved) {
            System.out.println("All tasks were moved successfully");
        } else {
            System.out.println("Error: Some tasks were not moved correctly");
        }

    }

    public static void dragAndDrop(WebDriver driver, WebElement source, WebElement target) throws InterruptedException {
        Actions actions = new Actions(driver);
        int xOffset = target.getLocation().getX() + (target.getSize().getWidth() / 2);
        int yOffset = target.getLocation().getY() + (target.getSize().getHeight() / 2);

        actions.moveToElement(source)
                .clickAndHold()
                .pause(Duration.ofMillis(500))
                .moveByOffset(10, 10)
                .pause(Duration.ofMillis(500))
                .moveToLocation(xOffset, yOffset)
                .pause(Duration.ofMillis(500))
                .release()
                .build()
                .perform();
        Thread.sleep(2000);
    }

    public static void dragAndDropWithScroll(WebDriver driver, WebElement source, WebElement target) throws InterruptedException {
        Actions actions = new Actions(driver);

        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", source);
        actions.moveToElement(source)
                .clickAndHold()
                .pause(Duration.ofMillis(500))
                .moveByOffset(10, 10)
                .pause(Duration.ofMillis(500))
                .build()
                .perform();

        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", target);

        int xOffset = target.getLocation().getX() + (target.getSize().getWidth() / 2);
        int yOffset = target.getLocation().getY() + (target.getSize().getHeight() / 2);

        actions.moveToLocation(xOffset, yOffset)
                .pause(Duration.ofMillis(500))
                .release()
                .build()
                .perform();
        Thread.sleep(2000);
    }
}
