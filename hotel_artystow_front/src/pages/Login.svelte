<script>
    import {HotelArtystowApi} from '../lib/HotelArtystowApi';
    import {navigateTo} from '../lib/navigation';

    export let params;
    const api = new HotelArtystowApi();
    let loginError = '';


    async function submitForm() {
        const data = {username: document.querySelector('#username').value, password: document.querySelector('#password').value};

        const res = await api.login(data.username, data.password);

        if(!res.status) {
            loginError = res.message;
            return;
        }

        navigateTo('/profile');
        sessionStorage.setItem('loggedIn', '1');
    }

    async function testLogin(){
        console.log(await api.getUsers());
    }

</script>

<div class="login-box-wrapper">
    <div class="login-box">
        <img src="/public/svg/logo_test.svg" alt="logo" class="login-logo">
        <input type="text" placeholder="Username" id="username">
        <input type="password" placeholder="Password" id="password">
        <span>{loginError}</span>
        <button type="button" id="submit-button" on:click={submitForm}>Zaloguj</button>
        <button type="button" id="submit" on:click={testLogin}>Zaloguj</button>
    </div>
</div>
