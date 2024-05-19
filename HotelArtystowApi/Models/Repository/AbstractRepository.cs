using System.Data.Common;
using HotelArtystowApi.Models.Entity;
using MySqlConnector;

namespace HotelArtystowApi.Models.Repository;

public abstract class AbstractRepository<T>
{
    public MySqlDataSource dataSource;
    protected AbstractRepository(MySqlDataSource dataSource)
    {
        this.dataSource = dataSource;
    }

    async protected Task<IReadOnlyList<T>> RunSelect(String query, Dictionary<String, dynamic>? queryParams)
    {
        MySqlConnection connection = await dataSource.OpenConnectionAsync();
        MySqlCommand command = connection.CreateCommand();
        command.CommandText = query;
        return await ReadAllAsync(await command.ExecuteReaderAsync());
    }

    async protected Task<bool> RunInsert(String tableName, AbstractEntity entity)
    {
        Dictionary<String, dynamic?> columns = entity.ToDictionary();
        columns.Remove("Id");

        String columnString = String.Join(", ", columns.Keys);
        String prep = "@" + String.Join(", @", columns.Keys);

        String query = $"INSERT INTO {tableName} ({columnString}) VALUES ({prep})";

        MySqlCommand command = await GetCommand(query);

        BindQueryParams(command, columns);

        int res = await command.ExecuteNonQueryAsync();

        entity.Id = (long)command.LastInsertedId;

        return res > 0;
    }

    async protected Task<MySqlCommand> GetCommand(String query)
    {
        MySqlConnection connection = await dataSource.OpenConnectionAsync();
        MySqlCommand command = connection.CreateCommand();
        command.CommandText = query;

        return command;
    }

    protected void BindQueryParams(MySqlCommand command, Dictionary<String, dynamic?> dictionary)
    {
        foreach(KeyValuePair<String, dynamic?> entry in dictionary)
        {
            command.Parameters.AddWithValue($"@{entry.Key}", entry.Value);
        }
    }

    protected abstract Task<IReadOnlyList<T>> ReadAllAsync(DbDataReader reader);
}
