# adonis-ally-extended
Additional Services for AdonisJS Ally package


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
}
...
```

That's all!

## Usage

Now you can access, the `ally` object on each HTTP request

```js
Route.get('vk', async ({ ally }) => {
  await ally.driver('vk').redirect()
})

Route.get('authenticated/vk', async ({ ally }) => {
  const user = await ally.driver('vk').getUser()

  return user
})
```
