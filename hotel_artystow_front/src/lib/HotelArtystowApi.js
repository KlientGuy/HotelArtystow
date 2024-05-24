export class HotelArtystowApi
{
    /**
     * @private
     * @type {string}
     */
    _apiUrl;

    constructor() {
        this._apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
    }

    /**
     * @public
     * @param {string} username 
     * @param {string} password 
     * @returns Promise<object>;
     */
    async login(username, password) {
        const res = await this._sendPostRequest('/users/login', {username, password});

        return await this._parseResponse(res);
    }

    /**
     * @public
     * @returns Promise<object>
     */
    async getUsers() {
        const res = await this._sendGetRequest('/users/getUsers');
        return await this._parseResponse(res);
    }

    /**
     * @public
     * @param {number} [userId=null] 
     * @returns Promise<object>
     */
    async getProfileData(userId = null) {
        let res;
        if(userId === null)
            res = await this._sendGetRequest('/users/profile');
        else
            res = await this._sendGetRequest(`/users/profile/${userId}`);

        return await this._parseResponse(res);
    }

    /**
     * @public
     * @param {string} value 
     * @returns Promise<object>
     */
    async saveProfileDescription(value) {
        const res = await this._sendPostRequest('/users/profile/saveDescription', value);
        return await this._parseResponse(res);
    }

    /**
    * @private
    * @param {string} endpoint 
    * @param {object} [queryParams=null] 
    */
    async _sendGetRequest(endpoint, queryParams = null) {

        let queryPart = '';
        if(queryParams !== null) {
            const params = new URLSearchParams(queryParams);
            queryPart = `?${params.toString()}`;
        }

        const res = await fetch(this._apiUrl + endpoint + queryPart, {
            credentials: 'include',
            method: 'GET',
        })

        return res;
    }

    /**
    * @private
    * @param {string} endpoint 
    * @param {object|string|number} body 
    */
    async _sendPostRequest(endpoint, body) {

        const res = await fetch(this._apiUrl + endpoint, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        return res;
    }

    /**
    * @param {Response} response 
    */
    async _parseResponse(response) {
        if(response.ok) {

            if(response.headers.get('Content-Length') === '0')
                return {status: true, data: {}};

            return {
                status: true,
                data: await response.json()
            }
        }

        return {
            status: false,
            message: await response.text()
        }
    }
        
}
