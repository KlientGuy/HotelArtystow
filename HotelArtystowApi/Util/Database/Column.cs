using System.Data.Common;

namespace HotelArtystowApi.Util.Database;


public static class Column
{
    public static T? Cast<T>(String colname, DbDataReader reader)
    {
        object value = reader.GetValue(reader.GetOrdinal(colname));

        if(value == DBNull.Value)
            return default(T);

        return (T)value;
    }
}
