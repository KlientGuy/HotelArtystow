<script>
    import Router from './lib/router';
    import Navbar from "./lib/Navbar.svelte";
    import * as Types from './lib/types';

    import '/node_modules/@fortawesome/fontawesome-free/css/all.css';

    const router = new Router();
    let currentComponent = Router.currentComponent;
    let params = {
        query: Router.currentParams,
        route: Router.routeParams
    };
    let currentRoute = location.pathname;

    document.addEventListener('onPageChange', handleOnPageChange)

    /**
    * @param {Types.PageChangeEvent} e 
    */
    function handleOnPageChange(e) {

        currentComponent = e.detail.component();
        params = {
            query: e.detail.params(),
            route: e.detail.routeParams()
        };
        currentRoute = location.pathname;
    }

</script>

<style>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

{#if currentRoute !== '/login'}
    <Navbar/>
{/if}

<main>
    {#key currentRoute}
        <svelte:component this={currentComponent} bind:params/>
    {/key}
</main>
