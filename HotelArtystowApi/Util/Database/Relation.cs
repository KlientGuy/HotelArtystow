using HotelArtystowApi.Models.Entity;

namespace HotelArtystowApi.Util.Database;

public class Relation<T> where T : AbstractEntity
{
    public long Key { get; private set; }
    public T? Value { get; set; }

    public Relation(long key, T? value)
    {
        Key = key;
        Value = value;
    }
}
