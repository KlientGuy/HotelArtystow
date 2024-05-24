namespace HotelArtystowApi.Util.Database;

using HotelArtystowApi.Models.Entity;

public class UpdateTracker<T> where T : AbstractEntity
{
    private Dictionary<String, Dictionary<String, dynamic?>> _changes = new Dictionary<string, Dictionary<string, dynamic?>>();

    public void Set(T entity)
    {
        _changes[$"{entity.GetType().Name}_{entity.Id}"] = entity.ToDictionary();
    }

    public Dictionary<String, dynamic?>? Get(T entity)
    {
        String key = $"{entity.GetType().Name}_{entity.Id}";
        return _changes.TryGetValue(key, out Dictionary<String, dynamic?>? found) ? found : null;
    }

    public Dictionary<String, dynamic?> GetDiff(T entity)
    {
        Dictionary<String, dynamic?>? original = Get(entity);

        if(original is null)
            return entity.ToDictionary();

        Dictionary<String, dynamic?> columns = entity.ToDictionary();
        Dictionary<String, dynamic?> diff = new Dictionary<String, dynamic?>();

        foreach(KeyValuePair<String, dynamic?> entry in columns)
        {
            dynamic? ogValue = original[entry.Key];

            if(ogValue == entry.Value)
                continue;

            diff[entry.Key] = entry.Value;
        }

        return diff;
    }
}
