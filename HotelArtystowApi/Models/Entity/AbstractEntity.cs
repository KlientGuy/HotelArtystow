using System.Reflection;
using HotelArtystowApi.Util.Database;

namespace HotelArtystowApi.Models.Entity;

public abstract class AbstractEntity
{
    public long Id { get; set; }
    public Dictionary<String, dynamic?> Scalars {get; set; }= new Dictionary<String, dynamic?>();

    public Dictionary<String, dynamic?> ToDictionary()
    {
        Type type = GetType();
        PropertyInfo[] properties = type.GetProperties();

        Dictionary<String, dynamic?> toReturn = new Dictionary<String, dynamic?> {};

        foreach(PropertyInfo property in properties)
        {
            var val = property.GetValue(this);

            if(val is not null)
            {
                Type valType = val.GetType();
                if(valType.IsGenericType)
                {
                    if(valType.GetGenericTypeDefinition() == typeof(Relation<>))
                        val = (long?)val.GetType().GetProperty("Key")?.GetValue(val);
                    else if(valType.GetGenericTypeDefinition() == typeof(ReverseRelation<>))
                        continue;
                }
            }

            toReturn[property.Name] = val;
        }

        return toReturn;
    }

    public T ToDTO<T>() where T : AbstractDTO, new()
    {
        Dictionary<String, dynamic?> dict = this.ToDictionary();
        T dto = new T();

        PropertyInfo[] props = dto.GetType().GetProperties();

        foreach(PropertyInfo property in props)
        {
            dict.TryGetValue(property.Name, out dynamic? val);
            property.SetValue(dto, val);
        }

        return dto;
    }

    public override string ToString()
    {
        Dictionary<String, dynamic> props = this.ToDictionary()!;

        String propsStr = "";
        foreach(KeyValuePair<String, dynamic> entry in props)
        {
            propsStr += $"  {entry.Key}: {entry.Value}\n";
        }

        return $@"
{GetType()}: {{
{propsStr}
}}
        ";
    }
}
