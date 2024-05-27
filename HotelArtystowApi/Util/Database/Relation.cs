using HotelArtystowApi.Models.Entity;

namespace HotelArtystowApi.Util.Database;

public class Relation<T, T2> where T2 : AbstractEntity
{
    public T Key { get; private set; }
    public T2? Value { get; set; }

    public Relation(T key, T2 value)
    {
        Key = key;
        Value = value;
    }
}
