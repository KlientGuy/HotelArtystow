using System.Data.Common;
using MySqlConnector;

using HotelArtystowApi.Models.Entity;
using HotelArtystowApi.Util.DBUtil;

namespace HotelArtystowApi.Models.Repository;

public sealed class UserRepository : AbstractRepository<User>
{
    public UserRepository(MySqlDataSource dataSource) : base(dataSource){}

    public async Task<IReadOnlyList<User>> GetAllUsers()
    {
        return await RunSelect("SELECT * FROM users", null);
    }

    public async Task<User?> GetBy(String column, dynamic value)
    {
        IReadOnlyList<User> res = await RunSelect($"SELECT * FROM users WHERE {column} = @search", new Dictionary<String, dynamic?>{{"search", value}});

        return res.FirstOrDefault();
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
            user.Id = DBCast<int>("id", reader);
            user.Username = DBCast<String>("username", reader);
            user.Password = DBCast<String>("password", reader);
            user.Firstname = DBCast<String>("firstname", reader);
            user.Lastname = DBCast<String>("lastname", reader);
            user.Description = DBCast<String>("description", reader);

            toReturn.Add(user);
        }

        return toReturn;
    }
}
