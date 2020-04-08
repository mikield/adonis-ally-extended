<h1 align="center">Welcome to Adonis Ally Extended 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.7.1-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/mikield/adonis-ally-extended#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/mikield/adonis-ally-extended/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/mikield/adonis-ally-extended/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/mikield/AdonisAllyExtended" />
  </a>
  <a href="https://twitter.com/AdmiralMiki" target="_blank">
    <img alt="Twitter: AdmiralMiki" src="https://img.shields.io/twitter/follow/AdmiralMiki.svg?style=social" />
  </a>
</p>

This package gives you additional social services to auth your users.

Any of service that accepts OAuth can be added. If you want an additional service - please create a issue and I will take my time to add it.
Avaiable services for now are:
* Twitch.tv
* Mixer.com
* Vk.com (Thanks to [@oddie](https://github.com/oddie))
* Patreon.com (Thanks to [@mindofjonas](https://github.com/mindofjonas))

## Install

```sh
adonis install @mikield/adonis-ally-extended
```

#### The provider will be registered inside `start/app.js` file.

```js
const providers = [
  '@mikield/adonis-ally-extended/ServiceProvider'
]
```

#### Add additional fields to `config/services.js` file.

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
 | Patreon Configuration
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

## Author

👤 **Vladyslav Gaysyuk <hello@mikield.rocks>**

* Website: https://mikield.rocks
* Twitter: [@AdmiralMiki](https://twitter.com/AdmiralMiki)
* Github: [@mikield](https://github.com/mikield)
* LinkedIn: [@mikield](https://linkedin.com/in/mikield)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/mikield/adonis-ally-extended/issues). You can also take a look at the [contributing guide](https://github.com/mikield/adonis-ally-extended/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/mikield">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## 📝 License

Copyright © 2020 [Vladyslav Gaysyuk](https://github.com/mikield).<br />
This project is [MIT](https://github.com/mikield/adonis-ally-extended/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_