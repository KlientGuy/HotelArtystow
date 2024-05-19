using System.Data.Common;
using HotelArtystowApi.Models.Entity;
using MySqlConnector;

namespace HotelArtystowApi.Models.Repository;

public sealed class UserRepository : AbstractRepository<User>
{
    public UserRepository(MySqlDataSource dataSource) : base(dataSource){}

    public async Task<IReadOnlyList<User>> GetAllUsers()
    {
        return await RunSelect("SELECT * FROM users", null);
    }

    public async Task<bool> CreateUser(User user) 
    {
        return await this.RunInsert("users", user);
    }

    protected override async Task<IReadOnlyList<User>> ReadAllAsync(DbDataReader reader)
    {
        List<User> toReturn = new List<User>{};

        while(await reader.ReadAsync())
        {
            User user = new User();
            user.Id = reader.GetInt32(0);
            user.Username = reader.GetString(1);

            toReturn.Add(user);
        }

        return toReturn;
    }
}
