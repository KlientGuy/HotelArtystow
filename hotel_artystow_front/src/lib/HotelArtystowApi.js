import { navigateTo } from "./navigation";

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

    async getNavbarData() {
        const res = await this._sendGetRequest('/users/profile/getNavbarStats');
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
     * @public
     * @returns Promise<object>
     */
    async getZjebleUserSession() {
        const res = await this._sendGetRequest('/zjeble/getUserSession');
        return await this._parseResponse(res);
    }

    /**
     * @public
     * @param {string} answer 
     * @returns Promise<object>
     */
    async submitZjebleAnswer(answer) {
        const res = await this._sendPostRequest('/zjeble/submitAnswer', answer);
        return await this._parseResponse(res);
    }

    /**
     * @public
     * @returns Promise<object>
     */
    async getZjebleImage() {
        const res = await this._sendGetRequest('/zjeble/getImageForUser');
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

            let resData = null;
            console.log(response.headers.get('Content-Type'));
            let contentType = response.headers.get('Content-Type');

            if(contentType.includes(';')) {
                contentType = contentType.substring(0, contentType.indexOf(';'));
            }
            switch(contentType) {
                case 'image/webp':
                    resData = await response.blob();
                break;
                case 'text/plain':
                    resData = await response.text();
                case 'application/json':
                    resData = await response.json();
                break;
            }

            return {
                status: true,
                data: resData
            }
        }
        else if(response.status == 401) {
            navigateTo('/login');
        }

        return {
            status: false,
            message: await response.text()
        }
    }
        
}
