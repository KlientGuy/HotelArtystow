using System.Data.Common;
using MySqlConnector;

using HotelArtystowApi.Models.Entity;

namespace HotelArtystowApi.Models.Repository.TemplateRepository;

public sealed class TemplateRepository : AbstractRepository<User>
{
    protected override string TableName { get; set; } = "template";

    public TemplateRepository(MySqlDataSource dataSource) : base(dataSource){}

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
            updateTracker.Set(user);
            toReturn.Add(user);
        }

        return toReturn;
    }
}
