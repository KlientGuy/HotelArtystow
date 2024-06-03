using System.Data.Common;
using HotelArtystowApi.Models.Entity;
using HotelArtystowApi.Util.Database;
using MySqlConnector;

namespace HotelArtystowApi.Models.Repository;

public abstract class AbstractRepository<T> where T : AbstractEntity
{
    protected UpdateTracker<T> updateTracker = new UpdateTracker<T>();
    protected MySqlDataSource dataSource;

    protected abstract String TableName { get; set; }

    protected AbstractRepository(MySqlDataSource dataSource)
    {
        this.dataSource = dataSource;
    }

    async protected Task<IReadOnlyList<T>> RunSelect(String query, Dictionary<String, dynamic?>? queryParams)
    {
        MySqlCommand command = await GetCommand(query);

        if(queryParams is not null)
            BindQueryParams(command, queryParams);

        Console.WriteLine(command.CommandText);

        return await ReadAllAsync(await command.ExecuteReaderAsync());
    }

    async protected Task<bool> RunInsert(T entity)
    {
        Dictionary<String, dynamic?> columns = entity.ToDictionary();
        columns.Remove("Id");

        String columnString = String.Join(", ", columns.Keys);
        String prep = "@" + String.Join(", @", columns.Keys);

        String query = $"INSERT INTO {TableName} ({columnString}) VALUES ({prep})";

        MySqlCommand command = await GetCommand(query);

        BindQueryParams(command, columns);

        int res = await command.ExecuteNonQueryAsync();

        entity.Id = (long)command.LastInsertedId;

        return res > 0;
    }

    async protected Task<bool> RunUpdate(T entity)
    {
        if(entity.Id == 0L)
            throw new Exception("Cannot update entity when Id is null");

        Dictionary<String, dynamic?> diff = updateTracker.GetDiff(entity);

        List<String> toUpdate = new List<string> {};

        foreach(KeyValuePair<String, dynamic?> entry in diff)
        {
            toUpdate.Add($"{entry.Key} = @{entry.Key}");
        }

        if(toUpdate.Count == 0)
            return true;

        String toUpdateStr = String.Join(", ", toUpdate);
        String query = $"UPDATE {TableName} SET {toUpdateStr} WHERE id = @Id";
        Console.WriteLine(query);

        diff["Id"] = entity.Id;

        MySqlCommand command = await GetCommand(query);
        BindQueryParams(command, diff);

        int res = await command.ExecuteNonQueryAsync();

        return res > 0;
    }

    async public Task<IReadOnlyList<T>> GetBy(Dictionary<String, dynamic?> search)
    {
        List<String> columns = [];

        foreach(KeyValuePair<String, dynamic?> entry in search)
        {
            columns.Add($"{entry.Key} = @{entry.Key}");
        }

        return await RunSelect($"SELECT * FROM {TableName} WHERE {String.Join(" AND ", columns)}", search);
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

    protected DBT Cast<DBT>(String colname, DbDataReader dataReader)
    {
        return Column.Cast<DBT>(colname, dataReader);
    }

    protected abstract Task<IReadOnlyList<T>> ReadAllAsync(DbDataReader reader);
}
