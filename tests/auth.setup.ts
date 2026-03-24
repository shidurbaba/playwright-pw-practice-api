import { test as setup } from '@playwright/test';
import user from '../.auth/user.json'
import fs from 'fs'
const authFile = '.auth/user.json'

setup('authentication', async ({ request }) => {
    //Get access token - Required step to delete newly created article
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login',

        {
            //this is the payload for user id and password
            data: {
                "user": {
                    "email": "mperistest@test.com",
                    "password": "Welcome289"
                }
            }
        }
    )
    const responseBody = await response.json()
    const accessToken = responseBody.user.token
    console.log(`AccessToken caputred`)
    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync(authFile, JSON.stringify(user))

    process.env['ACCESS_TOKEN'] = accessToken
})