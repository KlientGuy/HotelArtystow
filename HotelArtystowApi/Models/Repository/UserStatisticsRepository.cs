using System.Data.Common;
using MySqlConnector;

using HotelArtystowApi.Models.Entity;

namespace HotelArtystowApi.Models.Repository;

public sealed class UserStatisticsRepository : AbstractRepository<UserStatistics>
{
    protected override string TableName { get; set; } = "userStatistics";

    public UserStatisticsRepository(MySqlDataSource dataSource) : base(dataSource){}

    public async Task<bool> CreateUserStatistics(UserStatistics user) 
    {
        return await this.RunInsert(user);
    }

    public async Task<bool> Update(UserStatistics user)
    {
        return await this.RunUpdate(user);
    }

    public async Task<bool> UpdateLoginStreak(UserStatistics userStatistics)
    {
        int lastLoginDiff = DateTime.Now.DayOfYear - (userStatistics.User.Value!.LastLogin ?? DateTime.MinValue).DayOfYear;
        if(lastLoginDiff == 1)
        {
            userStatistics.LoginStreak++;
            return await Update(userStatistics);
        }
        else if(lastLoginDiff != 0)
        {
            userStatistics.LoginStreak = 1;
            return await Update(userStatistics);
        }

        return true;
    }

    public async Task<IReadOnlyList<UserStatistics>> GetByRank()
    {
        AddScalar("place");
        AddScalar("firstname");
        return await RunSelect($@"
                SELECT 
                    us.*,
                    u.firstname,
                    RANK() OVER (ORDER BY bees DESC) as place
                FROM {TableName} us
                INNER JOIN users u on u.id = us.userId
                ORDER BY bees DESC
        ", null);
    }

    public async Task<UserStatistics> GetWithUserRank(User user) 
    {
        AddScalar("place");
        Dictionary<String, dynamic?> queryParams = new Dictionary<String, dynamic?>() {{"userId", user.Id}};
        return (await RunSelect($@"
            WITH ranks as (
                SELECT
                    us.*,
                    RANK() OVER (ORDER BY bees DESC) as place
                FROM userStatistics us
                INNER JOIN users u on u.id = us.userId
            )

            SELECT * FROM ranks WHERE userId = @userId
        ", queryParams)).First();
    }

    protected override async Task<IReadOnlyList<UserStatistics>> ReadAllAsync(DbDataReader reader)
    {
        List<UserStatistics> toReturn = new List<UserStatistics>{};

        while(await reader.ReadAsync())
        {
            UserStatistics userStatistics = new UserStatistics(new Util.Database.Relation<User>(Cast<int>("userId", reader), null));
            userStatistics.Id = Cast<int>("id", reader);
            userStatistics.Bees = Cast<int>("bees", reader);
            userStatistics.LoginStreak = Cast<int>("loginStreak", reader);
            userStatistics.Division = Cast<int>("divisionId", reader);

            ReadScalars(userStatistics, reader);

            updateTracker.Set(userStatistics);
            toReturn.Add(userStatistics);
        }

        return toReturn;
    }
}
