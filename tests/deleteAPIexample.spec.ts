import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json';
import { user, article } from '../test-data/usertestdata.json';

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
  


});

test('delete article - Test 2', async ({ page, request }) => {
    //1.This is login endpoint url
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login',

        {
            //this is the payload for user id and password
            data: {user}
        }
    )
    const responseBody = await response.json()
    const accessToken = responseBody.user.token

    //2.This is endpoint - after publishing article successfully.
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {

        //this is the payload for article creation
        data: {article},
        headers:
        {
            Authorization: `Token ${accessToken}`
        }
    })

    //Verify Response - this will validate whether payload was deleted successfully.
    expect(articleResponse.status()).toEqual(201)

    //3. Delete Article
    await page.getByText('Global Feed').click()
    await page.getByText('This is a test title').click()
    await page.getByRole('button', { name: "Delete Article" }).first().click()
    await page.getByText('Global Feed').click()

    //Verify Title is deleted successfuly from UI.
    await expect(page.locator('app-article-list h1').first()).not.toContainText('This is a test title')

})