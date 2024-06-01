/**
* @typedef {object} UserData
* @property {string} username
* @property {string} firstname
* @property {string} description
* @property {string} profilePic
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
 */

export const Types = {};
