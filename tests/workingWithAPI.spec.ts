import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json';

test.beforeEach(async ({ page }) => {
    //Playwright Mock - Configure it inside the playwright framework before browser to make a call to the certain API
    // *** - wild card
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })

    // */** - wild card
    await page.route('*/**/api/articles*', async route => {
        const response = await route.fetch();
        const responseBody = await response.json();
        responseBody.articles[0].title = "This is a test title"
        responseBody.articles[0].description = "This is a description"


        await route.fulfill({
            body: JSON.stringify(responseBody)
        })
    })

    await page.goto('https://conduit.bondaracademy.com/');
    console.log("Navigated to page and mocked data.")
});

test('has title', async ({ page }) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText('This is a test title')
    await page.waitForTimeout(1000)
    await expect(page.locator('app-article-list p').first()).toContainText("This is a description")

})