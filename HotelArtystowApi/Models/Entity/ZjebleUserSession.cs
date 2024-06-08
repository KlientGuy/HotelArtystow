using HotelArtystowApi.Util.Database;

namespace HotelArtystowApi.Models.Entity;

public sealed class ZjebleUserSession : AbstractEntity
{
    public long UserId { get; set; }
    public int LivesLeft { get; set; }
    public Relation<ZjebleRound> Round { get; set; } = new Relation<ZjebleRound>(0, new ZjebleRound());
    public DateTime StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
}

public sealed class ZjebleUserSessionClearDTO : AbstractDTO
{
    public long UserId { get; set; }
    public int LivesLeft { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
}
