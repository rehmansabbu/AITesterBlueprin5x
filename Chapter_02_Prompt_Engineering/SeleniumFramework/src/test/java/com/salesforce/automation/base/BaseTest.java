package com.salesforce.automation.base;

import com.salesforce.automation.pages.LoginPage;
import java.io.InputStream;
import java.time.Duration;
import java.util.Properties;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeTest;

public class BaseTest {

    private static final Properties CONFIG = new Properties();

    protected WebDriver driver;
    protected LoginPage loginPage;

    static {
        try (InputStream stream = BaseTest.class.getClassLoader().getResourceAsStream("config.properties")) {
            if (stream == null) {
                throw new IllegalStateException("config.properties not found on classpath");
            }
            CONFIG.load(stream);
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to load configuration", exception);
        }
    }

    protected static String getConfig(String key) {
        String value = CONFIG.getProperty(key);
        if (value == null) {
            throw new IllegalArgumentException("Missing configuration key: " + key);
        }
        return value.trim();
    }

    @BeforeTest(alwaysRun = true)
    public void launchBrowser() {
        try {
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--disable-notifications");
            options.addArguments("--remote-allow-origins=*");
            if (Boolean.parseBoolean(getConfig("headless"))) {
                options.addArguments("--headless=new");
            }
            driver = new ChromeDriver(options);
            driver.manage().window().maximize();
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        } catch (Exception exception) {
            throw new IllegalStateException("Browser launch failed", exception);
        }
    }

    @BeforeMethod(alwaysRun = true)
    public void openApplication() {
        try {
            driver.get(getConfig("base.url"));
            loginPage = new LoginPage(driver);
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to open application", exception);
        }
    }

    @AfterTest(alwaysRun = true)
    public void closeBrowser() {
        try {
            if (driver != null) {
                driver.quit();
            }
        } catch (Exception exception) {
            driver = null;
        }
    }
}
