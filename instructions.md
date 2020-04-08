
## Registering provider

The provider will be registered inside `start/app.js` file.

```js
const providers = [
  '@mikield/adonis-ally-extended/ServiceProvider'
]
```

Add additional fields to `config/services.js` file.

```js
...
/*
 |--------------------------------------------------------------------------
 | Vk Configuration
 |--------------------------------------------------------------------------
 |
 | You can access your application credentials from the vk developers
 | page. https://vk.com/apps?act=manage
 |
 */
vk: {
  clientId: Env.get('VK_CLIENT_ID'),
  clientSecret: Env.get('VK_CLIENT_SECRET'),
  redirectUri: `${Env.get('APP_URL')}/authenticated/vk`
},

/*
 |--------------------------------------------------------------------------
 | Twitch Configuration
 |--------------------------------------------------------------------------
 |
 | You can access your application credentials from the twitch developers
 | dashboard. https://dev.twitch.tv/dashboard
 |
 */
twitch: {
  clientId: Env.get('TWITCH_CLIENT_ID'),
  clientSecret: Env.get('TWITCH_CLIENT_SECRET'),
  redirectUri: `${Env.get('APP_URL')}/authenticated/twitch`
},

/*
 |--------------------------------------------------------------------------
 | Mixer Configuration
 |--------------------------------------------------------------------------
 |
 | You can access your application credentials from the Mixer developers
 | lab. https://mixer.com/lab/oauth
 |
 */
mixer: {
  clientId: Env.get('MIXER_CLIENT_ID'),
  clientSecret: Env.get('MIXER_CLIENT_SECRET'),
  redirectUri: `${Env.get('APP_URL')}/authenticated/mixer`
},

/*
 |--------------------------------------------------------------------------
 | Mixer Configuration
 |--------------------------------------------------------------------------
 |
 | You can access your application credentials from the Patreon developers
 | lab. https://www.patreon.com/developers
 |
 */
patreon: {
  clientId: Env.get('MIXER_CLIENT_ID'),
  clientSecret: Env.get('MIXER_CLIENT_SECRET'),
  redirectUri: `${Env.get('APP_URL')}/authenticated/mixer`
}
...
```

## Usage

Now you can access, the `ally` object on each HTTP request

```js
Route.get('/:service', async ({ request, ally }) => {
  let {service} = await request.all()
  await ally.driver(service).redirect()
})

Route.get('authenticated/:service', async ({ request, ally }) => {
  let {service} = await request.all()
  const user = await ally.driver(service).getUser()

  return user
})
```
