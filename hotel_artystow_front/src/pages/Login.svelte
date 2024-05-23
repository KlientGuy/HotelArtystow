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
        sessionStorage.setItem('userId', res.data.userId);
    }

    async function testLogin(){
        console.log(await api.getUsers());
    }

</script>

<div class="login-box bg-primary">
    <img src="/public/svg/logo_test.svg" alt="logo" class="login-logo">
    <form on:submit|preventDefault={submitForm} class="col align-items-center w-100">
        <div class="form-group field">
            <input type="text" class="form-field" placeholder="Login" name="login" id="username" autocomplete="off" required />
            <label for="login" class="form-label">Login</label>
        </div>

        <div class="form-group">
            <input type="password" class="form-field" placeholder="Hasło" name="password" id="password" required />
            <label for="password" class="form-label">Hasło</label>
        </div>
        <span>{loginError}</span>
        <button type="submit" id="submit-button" class="btn" style="margin-top: 50px">Zaloguj</button>
    </form>
</div>

