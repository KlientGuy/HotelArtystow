/**
* @typedef {object} UserData
* @property {string} username
* @property {string} firstname
* @property {string} description
* @property {string} profilePic
* @property {UserStatistics} userStatistics
*/

/**
 * @typedef {object} UserStatistics
 * @property {number} id
 * @property {number|string} loginStreak
 * @property {number|string} bees
 * @property {number|string} place
 * @property {Division} division
 */

/**
 * @typedef {object} Division
 * @property {string} name
 * @property {string} texture
 * @property {string} vertexShader
 * @property {string} fragmentShader
 */

/**
 * @typedef {CustomEvent & {detail: PageChangeEventDetails}} PageChangeEvent
 */

/**
 * @typedef {object} PageChangeEventDetails
 * @property {Function} component
 * @property {Function} params
 * @property {Function} routeParams
 */

/**
 * @typedef {object} RouterParams
 * @property {object} query
 * @property {object} route
 */

/**
 * @typedef {object} ZjebleRound
 * @property {number} id
 * @property {string} answer
 */

/**
 * @typedef {object} ZjebleUserSession
 * @property {number} id
 * @property {number} livesLeft
 * @property {ZjebleRound} round
 * @property {string} startedAt
 * @property {string} endedAt
 */

export const Types = {};
