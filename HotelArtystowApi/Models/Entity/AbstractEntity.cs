using System.Reflection;

namespace HotelArtystowApi.Models.Entity;

public abstract class AbstractEntity
{
    public long Id { get; set; }

    public Dictionary<String, dynamic?> ToDictionary()
    {
        Type type = GetType();
        PropertyInfo[] properties = type.GetProperties();

        Dictionary<String, dynamic?> toReturn = new Dictionary<String, dynamic?> {};

        foreach(PropertyInfo property in properties)
        {
            toReturn[property.Name] = property.GetValue(this);
        }

        return toReturn;
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
