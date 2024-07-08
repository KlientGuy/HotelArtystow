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

    @media only screen and (max-width: 500px) {
        th {
            font-size: 1.1rem;
        }

        th, td {
            padding: 0.5rem;
        }

        thead {
            font-size: 30px;
        }

        tbody {
            font-size: 1.1rem;
        }
    }
</style>

{#await getRanking()}
    <div class="bg-primary ranking-container">
        <Loading/>
    </div>
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
                        <td><span class="{badges[one.place - 1] ?? ''}">{one.place}</span></td>
                        <td>{one[0].firstname}</td>
                        <td>{one[0].userStatistics.bees}</td>
                        <td><a href="/profile/{one[0].id}"><i class="fa fa-search"></i></a></td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/await}
