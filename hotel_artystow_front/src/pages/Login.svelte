<script>
    import {HotelArtystowApi} from '../lib/HotelArtystowApi';
    import {navigateTo} from '../lib/navigation';

    export const params = {};
    const api = new HotelArtystowApi();
    let loginError = '';


    /**
    * @param {SubmitEvent & {currentTarget: HTMLFormElement}} e 
    */
    async function submitForm(e) {
        const formData = new FormData(e.currentTarget);
        const data = {};

        formData.forEach((value, key) => data[key] = value);

        const res = await api.login(data.username, data.password);

        if(!res.status) {
            loginError = res.message;
            return;
        }

        navigateTo('/profile');
        sessionStorage.setItem('loggedIn', '1');
        sessionStorage.setItem('userId', res.data.userId);
    }
</script>

<div class="login-box bg-primary">
    <img src="/svg/logo_test.svg" alt="logo" class="login-logo">
    <form on:submit|preventDefault={submitForm} class="col align-items-center w-100">
        <div class="form-group field">
            <input type="text" class="form-field" placeholder="Login" name="username" id="username" autocomplete="off" required />
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

