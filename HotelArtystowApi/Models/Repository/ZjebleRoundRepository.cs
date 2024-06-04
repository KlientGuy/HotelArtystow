using System.Data.Common;
using MySqlConnector;

using HotelArtystowApi.Models.Entity;

namespace HotelArtystowApi.Models.Repository;

public sealed class ZjebleRoundRepository : AbstractRepository<ZjebleRound>
{
    protected override string TableName { get; set; } = "zjebleRound";

    public ZjebleRoundRepository(MySqlDataSource dataSource) : base(dataSource){}

    public async Task<ZjebleRound?> GetBy(String column, dynamic value)
    {
        IReadOnlyList<ZjebleRound> res = await RunSelect($"SELECT * FROM {TableName} WHERE {column} = @search", new Dictionary<String, dynamic?>{{"search", value}});

        return res.FirstOrDefault();
    }

    public async Task<ZjebleRound> GetLatest()
    {
        IReadOnlyList<ZjebleRound> res = await RunSelect($"SELECT * FROM {TableName} ORDER BY id DESC LIMIT 1", new Dictionary<string, dynamic?>{});

        return res.First();
    }

    public async Task<bool> Create(ZjebleRound round) 
    {
        return await this.RunInsert(round);
    }

    public async Task<bool> Update(ZjebleRound round)
    {
        return await this.RunUpdate(round);
    }

    protected override async Task<IReadOnlyList<ZjebleRound>> ReadAllAsync(DbDataReader reader)
    {
        List<ZjebleRound> toReturn = new List<ZjebleRound>{};

        while(await reader.ReadAsync())
        {
            ZjebleRound round = new ZjebleRound();
            round.Id = Cast<int>("id", reader);
            round.PicturePath = Cast<String>("picturePath", reader);
            round.Answer = Cast<String>("answer", reader);

            updateTracker.Set(round);
            toReturn.Add(round);
        }

        await reader.CloseAsync();

        return toReturn;
    }
}
