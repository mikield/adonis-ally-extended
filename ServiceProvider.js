'use strict'

/*
* Adonis Ally Extended
*
* (c) Vladyslav Gaysyuk <hello@mikield.rocks>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { ServiceProvider } = require('@adonisjs/fold')

const Drivers = [
  { name: "vk", driver: require('./Drivers/Vk') },
  { name: "twitch", driver: require('./Drivers/Twitch') },
  { name: "mixer", driver: require('./Drivers/Mixer') },
]

class AllyServiceProvider extends ServiceProvider {

  /**
  * The register method called by ioc container
  * as a life-cycle method
  *
  * @method register
  *
  * @return {void}
  */
  register() {
    Drivers.forEach(({ name, driver }) => {
      this.app.extend('Adonis/Addons/Ally', name, () => {
        return driver
      })
    });
  }

  boot() {}


}

module.exports = AllyServiceProvider
