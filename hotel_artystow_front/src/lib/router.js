import Login from '../pages/Login.svelte'
import Profile from '../pages/Profile.svelte'

export default class Router {

    routes = new Map([
        ['/login', Login],
        ['/profile', Profile]
    ]);

    pageChangeEvent = new CustomEvent('onPageChange', {
        detail: {
            component: () => Router.currentComponent,
            params: () => Router.currentParams,
        }
    })

    static currentRoute = '/login';
    static currentComponent = Login;
    static currentParams = {};

    constructor() {

        if(location.pathname === '/index.html')
            location.pathname = '/login'

        /** @param {string} route */
        window['navigateTo'] = (route) => this.navigateTo(route);

        this.switchComponent(location.pathname, this._getQueryParams());

        document.querySelector('body').addEventListener('click', (/** @type {MouseEvent & {target: HTMLElement}} */ e) => this._handleHtmlAnchorClick(e));

        /** @param {PopStateEvent & {target: Window}} e */
        window.onpopstate = (e) => this._handleOnPopState(e);
    }

    /**
     * @public
     * @param {string} route 
     */
    navigateTo(route)
    {
        if(Router.currentRoute === route)
            return;

        window.history.pushState(null, '', route);

        /** @type {RegExpMatchArray | string | null} */
        let queryString = route.match(new RegExp(/\?.*/));

        if(queryString !== null) queryString = queryString[0];
        else queryString = '';

        const queryParams = new URLSearchParams(queryString);

        console.log(Object.fromEntries(queryParams));

        route = route.replace(new RegExp(/\?.*/), '');
        Router.currentRoute = route;
        window.scrollTo(0, 0);

        this.switchComponent(route, Object.fromEntries(queryParams));
    }
    
    /**
     * @param {string} route 
     * @param {object} [params={}] 
     */
    switchComponent(route, params = {})
    {
        Router.currentComponent = this.routes.get(route) ?? Login;
        Router.currentParams = params;
        document.dispatchEvent(this.pageChangeEvent);
    }

    /**
    * @private
    * @param {HTMLElement|HTMLAnchorElement} element 
    * @returns {HTMLAnchorElement|null}
    */
    _seekAnchorParent(element)
    {
        let found = false;

        /** @type {HTMLAnchorElement} */
        let toReturn;

        while(element.tagName !== 'A')
        {
            if(element.parentElement !== null && element.parentElement instanceof HTMLAnchorElement)
                toReturn = element.parentElement;
            else
            {
                found = false;
                break;
            }

            found = true;
        }

        if(found)
            return toReturn;
        else return null;
    }

    /**
     * @private
     * @returns {object}
     */
    _getQueryParams()
    {
        const search = location.search.replaceAll('%3D', '=');
        const params = new URLSearchParams(search);
        return Object.fromEntries(params);
    }

    /**
     * @param {MouseEvent & {target: HTMLElement}} event
     */
    _handleHtmlAnchorClick(event) {
        /** @type {HTMLElement} */
        const element = event.target;

        /** @type {HTMLAnchorElement} */
        let found = this._seekAnchorParent(element);

        if (found !== null) {
            event.preventDefault();

            const route = found.href.replace(location.origin, '');
            this.navigateTo(route);
        }
    }
    
    /**
    * @param {PopStateEvent & {target: Window}} event
    */
    _handleOnPopState(event) {

        /** @type {Window} */
        const target = event.target;

        const route = target.location.pathname;

        Router.currentRoute = route;

        this.switchComponent(route, this._getQueryParams());
    }
}
