package com.salesforce.automation.tests;

import com.salesforce.automation.base.BaseTest;
import java.time.Duration;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.Test;

public class ValidLoginTest extends BaseTest {

    @Test(priority = 1, description = "Verify login page UI elements are displayed")
    public void verifyLoginPageElements() {
        try {
            loginPage.useUsernameLoginForm();
            Assert.assertTrue(loginPage.isUsernameFieldDisplayed(), "Username field is not displayed");
            Assert.assertTrue(loginPage.isLoginButtonDisplayed(), "Login button is not displayed");
            Assert.assertTrue(loginPage.isRememberMeDisplayed(), "Remember me checkbox is not displayed");
        } catch (Exception exception) {
            Assert.fail("Login page element verification failed: " + exception.getMessage());
        }
    }

    @Test(priority = 2, description = "Verify a valid user can login successfully with remember me enabled")
    public void verifyValidLogin() {
        String username = getConfig("valid.username");
        String password = getConfig("valid.password");
        if (username.isEmpty() || password.isEmpty()) {
            throw new SkipException("Valid credentials are not configured in config.properties");
        }
        try {
            loginPage.useUsernameLoginForm();
            loginPage.setRememberMe(true);
            Assert.assertTrue(loginPage.isRememberMeSelected(), "Remember me option was not selected");
            loginPage.doLogin(username, password);
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(30));
            boolean navigatedAway = wait.until(ExpectedConditions.not(ExpectedConditions.urlContains("login.salesforce.com")));
            Assert.assertTrue(navigatedAway, "User was not redirected after a valid login");
        } catch (Exception exception) {
            Assert.fail("Valid login verification failed: " + exception.getMessage());
        }
    }
}
