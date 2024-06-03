<script>

    import Navbar from "../lib/Navbar.svelte";
    import Loading from "../lib/Loading.svelte";
</script>

<div class="bg-primary ranking-container">
    <table>
        <thead>
            <tr>
                <th>Miejsce</th>
                <th>Użytkownik</th>
                <th>Pszczoły</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><span class="badge first-place">1</span></td>
                <td>Salah</td>
                <td>456</td>
            </tr>
            <tr>
                <td><span class="badge second-place">2</span></td>
                <td>Kutes</td>
                <td>345</td>
            </tr>
            <tr>
                <td><span class="badge third-place">3</span></td>
                <td>Kitos</td>
                <td>123</td>
            </tr>
            <tr>
                <td>4</td>
                <td>Adam</td>
                <td>4</td>
            </tr>
        </tbody>
    </table>
</div>

<style>
    .ranking-container {
        width: 70vw;
        height: 70vh;
        display: flex;
        flex-direction: column;
        border-radius: 35px;
        padding: 1rem;
    }
    table, tr {
        border-bottom: 1px solid white;
        border-collapse: collapse;
        heigth: 5vh;
    }
    th, td {
        padding: 1rem;
    }
    thead {
        font-size: 30px;
    }

    tbody {
        font-size: 20px;
    }
</style>