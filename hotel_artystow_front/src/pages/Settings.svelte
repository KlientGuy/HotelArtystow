<script>
    import { HotelArtystowApi } from "../lib/HotelArtystowApi";

    export const params = {};

    /**
    * @param {SubmitEvent & {currentTarget: HTMLFormElement}} e 
    */
    async function submitSettingsForm(e) {
        const formData = new FormData(e.currentTarget);
        const json = {};
        for(const [key, value] of formData.entries()) {
            json[key] = value;
        }

        const api = new HotelArtystowApi();
        api.changePassword(json.password, json.passwordConfirm);
    }
</script>
<style>
    @media only screen and (min-width: 800px) {
        .form-group {
            min-width: 300px;
        }
    }
</style>
<div class="small-container bg-primary col align-center">
    <div class="row w-100 justify-center">
        <h2>Ustawienia</h2>
    </div>
    <div class="row w-100 justify-center">
        <form on:submit|preventDefault={(e) => submitSettingsForm(e)}>
            <div class="col w-100 align-items-center">
                <div class="form-group field">
                    <input name="password" type="text" class="form-field" placeholder="Hasło" id="password">
                    <label for="password" class="form-label">Hasło</label>
                </div>
                <div class="form-group field">
                    <input name="passwordConfirm" type="text" class="form-field" placeholder="Powtórz hasło" id="password-confirm">
                    <label for="password" class="form-label">Powtórz hasło</label>
                </div>
                <div class="w-100">
                    <button class="w-100" type="submit">Zapisz</button>
                </div>
            </div>
        </form>
    </div>
</div>
