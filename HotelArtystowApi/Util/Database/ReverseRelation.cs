namespace HotelArtystowApi.Util.Database;

public sealed class ReverseRelation<T>
{
    public long Key { get; private set; }
    public T? Value { get; set; }

    public ReverseRelation(long key, T? value)
    {
        Key = key;
        Value = value;
    }

}
