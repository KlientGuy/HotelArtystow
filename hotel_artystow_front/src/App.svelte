<script>
    import Login from './pages/Login.svelte'
    import Router from './lib/router';

    const router = new Router();
    let currentComponent = Router.currentComponent;
    let params = Router.currentParams;

    document.addEventListener('onPageChange', (e) => {
        currentComponent = e.detail.component();
        params = e.detail.params();
    })

</script>

<main>
    <svelte:component this={currentComponent} bind:params/>
</main>
