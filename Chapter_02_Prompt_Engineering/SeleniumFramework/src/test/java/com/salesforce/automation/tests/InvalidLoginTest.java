package com.salesforce.automation.tests;

import com.salesforce.automation.base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class InvalidLoginTest extends BaseTest {

    @DataProvider(name = "invalidCredentials")
    public Object[][] invalidCredentials() {
        return new Object[][] {
            {"", "Invalid@123"},
            {"invalid.user@example.com", ""},
            {"invalid.user@example.com", "Invalid@123"}
        };
    }

    @Test(dataProvider = "invalidCredentials", description = "Verify login is rejected for invalid credentials")
    public void verifyInvalidLogin(String username, String password) {
        try {
            loginPage.doLogin(username, password);
            Assert.assertTrue(loginPage.isErrorDisplayed(), "An error was expected for invalid login");
            Assert.assertFalse(loginPage.getErrorMessage().isEmpty(), "Error message text was empty");
        } catch (Exception exception) {
            Assert.fail("Invalid login verification failed: " + exception.getMessage());
        }
    }
}
