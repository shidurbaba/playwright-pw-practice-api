import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json';
import { user, article } from '../test-data/usertestdata.json';

test.beforeEach(async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');
    console.log("Navigated to page and mocked data.")

});

test('create & delete article using API - Test 3', async ({ page, request }) => {
    //Login using UI Steps
    await page.getByText('New Article').click()
    await page.getByRole('textbox', { name: 'Article Title' }).fill('Playwright is Awesome')
    await page.getByRole('textbox', { name: 'What\'s this ' }).fill('About the Playwright')
    await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('We like to use playwright for automation')
    await page.getByRole('button', { name: 'Publish Article' }).click()
    console.log("Logged In Successful From UI")

    //Get slugId Response - Important Interception Step
    const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const articleResponsBody = await articleResponse.json()
    const slugId = articleResponsBody.article.slug
    console.log(`SlugID caputred - ${slugId}`)

    await expect(page.locator('.article-page h1')).toContainText('Playwright is Awesome')
    await page.getByText('Home').click()
    await page.getByText('Global Feed').click()
    await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is Awesome')
    console.log("UI Assertion completed!")

    //Get access token - Required step to delete newly created article
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login',

        {
            //this is the payload for user id and password
            data: { user }
        }
    )
    const responseBody = await response.json()
    const accessToken = responseBody.user.token
    console.log(`AccessToken caputred`)

    //Delete Article Step using API
    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
        {
            headers:
            {
                Authorization: `Token ${accessToken}`
            }
        })
    console.log(`Successfully deleted article using API`)

    //Assertion of deleteArticleResponse 
    expect(deleteArticleResponse.status()).toEqual(204)
    console.log("Assertion was successful!!!")

}
)


