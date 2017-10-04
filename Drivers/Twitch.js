'use strict'

/*
 * adonis-ally twitch driver
 *
 * (c) Vladyslav Gaysyuk <mikield@icloud.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const CE = require('@adonisjs/ally/src/Exceptions')
const OAuth2Scheme = require('@adonisjs/ally/src/Schemes/OAuth2')
const AllyUser = require('@adonisjs/ally/src/AllyUser')
const got = require('got')
const utils = require('@adonisjs/ally/lib/utils')
const _ = require('lodash')

class Twitch extends OAuth2Scheme {

  constructor (Config) {
    const config = Config.get('services.ally.twitch')

    utils.validateDriverConfig('twitch', config, ['clientId', 'clientSecret', 'redirectUri'])

    super(config.clientId, config.clientSecret, config.headers)

    /**
     * Oauth specific values to be used when creating the redirect
     * url or fetching user profile.
     */
    this._scope = this._getInitialScopes(config.scope)
    this._api_version = config.api_version || 'v5'
    this._redirectUri = config.redirectUri
    this.config = config
    this._redirectUriOptions = _.merge({response_type: 'code'}, config.options)
  }

  /**
   * Injections to be made by the IoC container
   *
   * @return {Array}
   */
  static get inject () {
    return ['Adonis/Src/Config']
  }

  /**
   * Scope seperator for seperating multiple
   * scopes.
   *
   * @return {String}
   */
  get scopeSeperator () {
    return ' '
  }

  /**
   * Base url to be used for constructing
   * twitch oauth urls.
   *
   * @return {String}
   */
  get baseUrl () {
    return 'https://api.twitch.tv/kraken'
  }

  /**
   * Relative url to be used for redirecting
   * user.
   *
   * @return {String} [description]
   */
  get authorizeUrl () {
    return '/oauth2/authorize'
  }

  /**
   * Relative url to be used for exchanging
   * access token.
   *
   * @return {String}
   */
  get accessTokenUrl () {
    return '/oauth2/token'
  }

  /**
   * API url to be used for getting VKontakte user's profile
   *
   * @return {String}
   */
  get apiUrl () {
    return 'https://api.twitch.tv/kraken'
  }

  /**
   * Returns initial scopes to be used right from the
   * config file. Otherwise it will fallback to the
   * commonly used scopes
   *
   * @param   {Array} scopes
   *
   * @return  {Array}
   *
   * @private
   */
  _getInitialScopes (scopes) {
    return _.size(scopes) ? scopes : ['user_read']
  }

  /**
   * Returns the user profile as an object using the
   * access token
   *
   * @param   {String} accessToken
   * @param   {Array} [fields]
   *
   * @return  {Object}
   *
   * @private
   */
  async _getUserProfile (accessToken, fields) {
    const response = await got(`${this.apiUrl}/user`, {
      headers: {
        'Authorization': accessToken?'OAuth ' + accessToken : undefined,
        'Accept': `Accept: application/vnd.twitchtv.${this._api_version}+json`,
        'Client-ID': this.config.clientId
      },
      json: true
    })
    return response.body
  }

  /**
   * Returns the redirect url for a given provider.
   *
   * @param  {Array} scope
   *
   * @return {String}
   */
  async getRedirectUrl (scope) {
    scope = _.size(scope) ? scope : this._scope
    return this.getUrl(this._redirectUri, scope, this._redirectUriOptions)
  }

  /**
   * Parses provider error by fetching error message
   * from nested data property.
   *
   * @param  {Object} error
   *
   * @return {Error}
   */
  parseProviderError (error) {
    const parsedError = _.isString(error.data) ? JSON.parse(error.data) : null
    const message = _.get(parsedError, 'message', error)
    return CE.OAuthException.tokenExchangeException(message, error.statusCode, parsedError)
  }

  /**
   * Parses the redirect errors returned by twitch
   * and returns the error message.
   *
   * @param  {Object} queryParams
   *
   * @return {String}
   */
  parseRedirectError (queryParams) {
    return queryParams.error_message || 'Oauth failed during redirect'
  }

  /**
   * Returns the user profile with it's access token, refresh token
   * and token expiry
   *
   * @param {Object} queryParams
   * @param {Array} [fields]
   *
   * @return {Object}
   */
  async getUser (queryParams, fields) {
    const code = queryParams.code

    /**
     * Throw an exception when query string does not have
     * code.
     */
    if (!code) {
      const errorMessage = this.parseRedirectError(queryParams)
      throw CE.OAuthException.tokenExchangeException(errorMessage, null, errorMessage)
    }
    const accessTokenResponse = await this.getAccessToken(code, this._redirectUri, {
      grant_type: 'authorization_code'
    })
    const userProfile = await this._getUserProfile(accessTokenResponse.accessToken, fields)

    const user = new AllyUser()
    user
      .setOriginal(userProfile)
      .setFields(
        userProfile._id,
        userProfile.display_name,
        userProfile.email,
        userProfile.name,
        userProfile.logo
      )
      .setToken(
        accessTokenResponse.accessToken,
        accessTokenResponse.refreshToken,
        null,
        Number(accessTokenResponse.result.expires_in)
      )

    return user
  }
}

module.exports = Twitch
