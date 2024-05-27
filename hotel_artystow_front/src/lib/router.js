import Login from '../pages/Login.svelte'
import Profile from '../pages/Profile.svelte'
import Zjeble from '../pages/Zjeble.svelte'

export default class Router {

    routes = new Map([
        ['/login', Login],
        ['/profile', Profile],
        ['/profile/{id}', Profile],
        ['/zjeble', Zjeble]
    ]);

    pageChangeEvent = new CustomEvent('onPageChange', {
        detail: {
            component: () => Router.currentComponent,
            params: () => Router.currentParams,
            routeParams: () => Router.routeParams
        }
    })

    static currentRoute = '/login';
    static currentComponent = Login;
    static currentParams = {};
    static routeParams = {};

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
        let routeParams = {};
        if(!this.routes.has(route)) {
            const matchedRoute = this._matchRoute(route);
            route = matchedRoute.route;
            routeParams = matchedRoute.params;
        }


        Router.currentComponent = this.routes.get(route) ?? Login;
        Router.currentParams = params;
        Router.routeParams = routeParams;
        document.dispatchEvent(this.pageChangeEvent);
    }

    /**
     * @private
     * @param {string} route 
     */
    _matchRoute(route) {
        const keys = this.routes.keys();

        let bestMatch = null;
        const routeParams = {};
        for(const key of keys) {

            const matches = [...key.matchAll(/{.*?}/g)];

            if(matches.length === 0)
                continue;

            const splitTemplate = key.split('/');
            const splitRoute = route.split('/');

            splitTemplate.splice(0, 1);
            splitRoute.splice(0, 1);

            let goodRoute = false;

            for(let i = 0; i < splitTemplate.length; i++) {

                if(splitTemplate[i] === splitRoute[i]) {
                    goodRoute = !/{.*?}/.test(splitTemplate[i]);
                    continue;
                }
                
                if(splitRoute[i] == null)
                    goodRoute = false;

                routeParams[splitTemplate[i].replaceAll(/{|}/g, '')] = splitRoute[i];
            }

            if(goodRoute) {
                bestMatch = key;
                break;
            }
        }

        return {
            route: bestMatch,
            params: routeParams
        }
    }
    

    /**
    * @private
    * @param {HTMLElement|HTMLAnchorElement} element 
    * @returns {HTMLAnchorElement|null}
    */
    _seekAnchorParent(element)
    {

        if(element instanceof HTMLAnchorElement)
            return element;

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
