using HotelArtystowApi.Util.Database;

namespace HotelArtystowApi.Models.Entity;

public sealed class UserStatistics : AbstractEntity
{
    public Relation<User> User { get; set; }
    public int LoginStreak { get; set; } = 0;
    public int Bees { get; set; } = 0;
    public int Division { get; set; } = 1;

    public UserStatistics(Relation<User> user)
    {
        User = user;
    }
}

public sealed class UserNavbarDTO : AbstractDTO
{
    public int LoginStreak { get; set; } = 0;
    public int Bees { get; set; } = 0;
}
