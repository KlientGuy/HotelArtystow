<script>
    import Login from './pages/Login.svelte'
    import Router from './lib/router';
    import Navbar from "./lib/Navbar.svelte";

    const router = new Router();
    let currentComponent = Router.currentComponent;
    let params = Router.currentParams;

    document.addEventListener('onPageChange', (e) => {
        currentComponent = e.detail.component();
        params = e.detail.params();
    })

</script>

<style>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<Navbar/>

<main>
    <svelte:component this={currentComponent} bind:params/>
</main>
