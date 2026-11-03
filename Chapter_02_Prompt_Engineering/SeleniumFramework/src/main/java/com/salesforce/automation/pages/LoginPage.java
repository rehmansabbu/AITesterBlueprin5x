package com.salesforce.automation.pages;

import java.time.Duration;
import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement usernameField;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement passwordField;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//input[@id='rememberUn']")
    private WebElement rememberMeCheckbox;

    @FindBy(xpath = "//div[@id='error']")
    private WebElement errorContainer;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(30));
        PageFactory.initElements(driver, this);
    }

    public void useUsernameLoginForm() {
        try {
            List<WebElement> links = driver.findElements(By.xpath("//a[contains(.,'Log In with Username')]"));
            for (WebElement link : links) {
                if (link.isDisplayed()) {
                    link.click();
                    wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@id='username']")));
                    return;
                }
            }
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to switch to the username login form", exception);
        }
    }

    public void enterUsername(String username) {
        try {
            wait.until(ExpectedConditions.visibilityOf(usernameField));
            usernameField.clear();
            usernameField.sendKeys(username);
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to enter username", exception);
        }
    }

    public void enterPassword(String password) {
        try {
            wait.until(ExpectedConditions.visibilityOf(passwordField));
            passwordField.clear();
            passwordField.sendKeys(password);
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to enter password", exception);
        }
    }

    public void clickLogin() {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(loginButton));
            loginButton.click();
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to click login button", exception);
        }
    }

    public void doLogin(String username, String password) {
        try {
            useUsernameLoginForm();
            enterUsername(username);
            if (!isPasswordFieldDisplayed()) {
                clickLogin();
                wait.until((ExpectedCondition<Boolean>) condition -> isPasswordFieldDisplayed() || isErrorDisplayedNow());
            }
            if (isErrorDisplayedNow()) {
                return;
            }
            enterPassword(password);
            clickLogin();
        } catch (Exception exception) {
            throw new IllegalStateException("Login action failed", exception);
        }
    }

    public void setRememberMe(boolean remember) {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(rememberMeCheckbox));
            if (rememberMeCheckbox.isSelected() != remember) {
                rememberMeCheckbox.click();
            }
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to set remember me option", exception);
        }
    }

    public boolean isRememberMeSelected() {
        try {
            return rememberMeCheckbox.isSelected();
        } catch (Exception exception) {
            return false;
        }
    }

    public boolean isRememberMeDisplayed() {
        try {
            return rememberMeCheckbox.isDisplayed();
        } catch (Exception exception) {
            return false;
        }
    }

    public boolean isUsernameFieldDisplayed() {
        try {
            return usernameField.isDisplayed();
        } catch (Exception exception) {
            return false;
        }
    }

    public boolean isPasswordFieldDisplayed() {
        try {
            return passwordField.isDisplayed();
        } catch (Exception exception) {
            return false;
        }
    }

    public boolean isLoginButtonDisplayed() {
        try {
            return loginButton.isDisplayed();
        } catch (Exception exception) {
            return false;
        }
    }

    public boolean isErrorDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOf(errorContainer));
            return true;
        } catch (Exception exception) {
            return false;
        }
    }

    public String getErrorMessage() {
        try {
            wait.until(ExpectedConditions.visibilityOf(errorContainer));
            return errorContainer.getText().trim();
        } catch (Exception exception) {
            throw new IllegalStateException("Error message was not displayed", exception);
        }
    }

    private boolean isErrorDisplayedNow() {
        for (WebElement element : driver.findElements(By.xpath("//div[@id='error']"))) {
            try {
                if (element.isDisplayed()) {
                    return true;
                }
            } catch (Exception exception) {
                return false;
            }
        }
        return false;
    }

    public String getPageTitle() {
        try {
            return driver.getTitle();
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to read page title", exception);
        }
    }
}
