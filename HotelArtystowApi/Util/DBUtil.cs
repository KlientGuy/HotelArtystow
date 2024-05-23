using System.Data.Common;

namespace HotelArtystowApi.Util.DBUtil;


public static class DBUtil
{
    public static T DBCast<T>(String colname, DbDataReader reader)
    {
        object value = reader.GetValue(reader.GetOrdinal(colname));

        if(value == DBNull.Value)
            return default(T)!;

        return (T)value;
    }
}
