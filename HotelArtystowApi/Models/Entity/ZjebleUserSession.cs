using HotelArtystowApi.Util.Database;

namespace HotelArtystowApi.Models.Entity;

public class ZjebleUserSession : AbstractEntity
{
    public long UserId { get; set; }
    public int LivesLeft { get; set; }
    public Relation<long, ZjebleRound> Round { get; set; } = new Relation<long, ZjebleRound>(0, new ZjebleRound());
    public DateTime StartedAt { get; set; }
    public DateTime EndedAt { get; set; }
}
