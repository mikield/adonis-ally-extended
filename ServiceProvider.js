'use strict'

/*
* adonis-auth
*
* (c) Vladyslav Gaysyuk <mikield@icloud.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { ServiceProvider } = require('@adonisjs/fold')
const _ = require('lodash')

const Drivers = {
  vk: require('./Drivers/Vk'),
  twitch: require('./Drivers/Twitch')
}

class AllyServiceProvider extends ServiceProvider {
  /**
  * The register method called by ioc container
  * as a life-cycle method
  *
  * @method register
  *
  * @return {void}
  */
  boot () {
    _.forEach(Drivers, (implementation, name) => {
      this.app.extend('Adonis/Addons/Ally', name, () => {
        return this.app.make(implementation)
      })
    })

  }
}

module.exports = AllyServiceProvider
