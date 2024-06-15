<script>
    import Loading from "../lib/Loading.svelte";
    import { HotelArtystowApi } from "../lib/HotelArtystowApi";

    const api = new HotelArtystowApi();

    const badges = ['badge first-place', 'badge second-place', 'badge third-place'];

    async function getRanking() {
        const res = await api.getRanking();

        return res.data;
    }
</script>

<style>
    .ranking-container {
        width: 70vw;
        height: 70vh;
        display: flex;
        flex-direction: column;
        border-radius: 35px;
        padding: 1rem;
        overflow-y: scroll;
    }

    table, tr {
        border-bottom: 1px solid grey;
        border-collapse: collapse;
        height: 5vh;
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

{#await getRanking()}
    <Loading/>
{:then ranking}
    <div class="bg-primary ranking-container">
        <table>
            <thead>
                <tr>
                    <th>Miejsce</th>
                    <th>Użytkownik</th>
                    <th>Pszczoły</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {#each ranking as one}
                    <tr>
                        <td><span class="{badges[one.scalars.place - 1] ?? ''}">{one.scalars.place}</span></td>
                        <td>{one.scalars.firstname}</td>
                        <td>{one.bees}</td>
                        <td><a href="/profile/{one.user.key}"><i class="fa fa-search"></i></a></td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/await}
