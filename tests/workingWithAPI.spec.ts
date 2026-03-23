import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json';
import { request } from 'node:http';

test.beforeEach(async ({ page }) => {
    //Playwright Mock - Configure it inside the playwright framework before browser to make a call to the certain API
    //Request URL - https://conduit-api.bondaracademy.com/api/tags
    // *** - wild card
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })


    await page.goto('https://conduit.bondaracademy.com/');
    console.log("Navigated to page and mocked data.")
});

test('has title - Test 1', async ({ page }) => {
    //Request URL - https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0
    // */** - wild card
    await page.route('*/**/api/articles*', async route => {
        const response = await route.fetch();
        const responseBody = await response.json();
        responseBody.articles[0].title = "This is a mock title"
        responseBody.articles[0].description = "This is a mock description"
        responseBody.articles[1].title = "This is made up"


        await route.fulfill({
            body: JSON.stringify(responseBody)
        })
    })

    await page.waitForTimeout(500)
    await page.getByText('Global Feed').click()

    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText('This is a mock title')
    await page.waitForTimeout(500)
    await expect(page.locator('app-article-list p').first()).toContainText("This is a mock description")

})
