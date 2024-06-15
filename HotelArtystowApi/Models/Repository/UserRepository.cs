using System.Data.Common;
using MySqlConnector;

using HotelArtystowApi.Models.Entity;

namespace HotelArtystowApi.Models.Repository;

public sealed class UserRepository : AbstractRepository<User>
{
    protected override string TableName { get; set; } = "users";

    public UserRepository(MySqlDataSource dataSource) : base(dataSource){}

    public async Task<IReadOnlyList<User>> GetAllUsers()
    {
        return await RunSelect("SELECT * FROM users", null);
    }

    public async Task<bool> CreateUser(User user) 
    {
        return await this.RunInsert(user);
    }

    public async Task<bool> Update(User user)
    {
        return await this.RunUpdate(user);
    }

    protected override async Task<IReadOnlyList<User>> ReadAllAsync(DbDataReader reader)
    {
        List<User> toReturn = new List<User>{};

        while(await reader.ReadAsync())
        {
            User user = new User();
            user.Id = Cast<int>("id", reader);
            user.Username = Cast<String>("username", reader);
            user.Password = Cast<String>("password", reader);
            user.Firstname = Cast<String>("firstname", reader);
            user.Lastname = Cast<String>("lastname", reader);
            user.Description = Cast<String?>("description", reader);
            user.ProfilePic = Cast<String?>("profilePic", reader);
            user.LastLogin = Cast<DateTime?>("lastLogin", reader);

            ReadScalars(user, reader);

            updateTracker.Set(user);
            toReturn.Add(user);
        }

        await reader.CloseAsync();

        return toReturn;
    }
}
