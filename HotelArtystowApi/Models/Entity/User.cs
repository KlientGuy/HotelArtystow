using System.Reflection;

namespace HotelArtystowApi.Models.Entity;

public class User : AbstractEntity
{
    public String Username { get; set; } = "";
}
