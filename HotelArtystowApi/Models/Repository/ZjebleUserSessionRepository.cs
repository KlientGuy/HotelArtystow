using System.Data.Common;
using MySqlConnector;

using HotelArtystowApi.Util.Database;

using HotelArtystowApi.Models.Entity;

namespace HotelArtystowApi.Models.Repository;

public sealed class ZjebleUserSessionRepository : AbstractRepository<ZjebleUserSession>
{
    protected override string TableName { get; set; } = "zjebleUserSession";

    public ZjebleUserSessionRepository(MySqlDataSource dataSource) : base(dataSource){}

    public async Task<bool> Create(ZjebleUserSession session) 
    {
        return await this.RunInsert(session);
    }

    public async Task<bool> Update(ZjebleUserSession session)
    {
        return await this.RunUpdate(session);
    }

    protected override async Task<IReadOnlyList<ZjebleUserSession>> ReadAllAsync(DbDataReader reader)
    {
        List<ZjebleUserSession> toReturn = new List<ZjebleUserSession>{};

        while(await reader.ReadAsync())
        {
            ZjebleUserSession session = new ZjebleUserSession();
            session.Id = Cast<int>("id", reader);
            session.UserId = Cast<int>("userId", reader);
            session.LivesLeft = Cast<int>("livesLeft", reader);
            session.Round = new Relation<ZjebleRound>(Cast<int>("round", reader), new ZjebleRound());
            session.StartedAt = Cast<DateTime>("startedAt", reader);
            session.EndedAt = Cast<DateTime?>("endedAt", reader);

            updateTracker.Set(session);
            toReturn.Add(session);
        }
        await reader.CloseAsync();

        return toReturn;
    }
}
