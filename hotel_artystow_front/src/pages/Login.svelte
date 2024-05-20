<script>

    async function submitForm(event) {
        const data = {username: document.querySelector('#username').value, password: document.querySelector('#password').value};
        const response = await fetch('http://localhost:5222/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    async function testLogin(){
        const response = await fetch('http://localhost:5222/users/getUsers', {
            method: 'GET',
            credentials: "include"
        });
    }

</script>

<div class="login-box-wrapper">
    <div class="login-box">
        <img src="/public/svg/logo_test.svg" alt="logo" class="login-logo">
        <input type="text" placeholder="Username" id="username">
        <input type="password" placeholder="Password" id="password">
        <button type="button" id="submit-button" on:click={submitForm}>Zaloguj</button>
        <button type="button" id="submit" on:click={testLogin}>Zaloguj</button>
    </div>
</div>