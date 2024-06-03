using HotelArtystowApi.Util.Database;

namespace HotelArtystowApi.Models.Entity;

public sealed class UserStatistics : AbstractEntity
{
    public Relation<User>? User { get; set; }
    public int LoginStreak { get; set; }
    public int Bees { get; set; }
    public int Division { get; set; }
}
