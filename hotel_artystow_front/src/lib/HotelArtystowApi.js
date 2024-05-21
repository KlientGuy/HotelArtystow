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
    * @private
    * @param {string} endpoint 
    * @param {object} queryParams 
    */
    async _sendGetRequest(endpoint, queryParams) {

        const params = new URLSearchParams(queryParams);

        const res = await fetch(this._apiUrl + endpoint + `?${params.toString()}`, {
            credentials: 'include',
            method: 'GET',
        })

        return res;
    }

    /**
    * @private
    * @param {string} endpoint 
    * @param {object} body 
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
