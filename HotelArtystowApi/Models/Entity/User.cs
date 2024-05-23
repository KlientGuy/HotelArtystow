namespace HotelArtystowApi.Models.Entity;

public class User : AbstractEntity
{
    public String? Username { get; set; }
    public String? Password { get; set; }
    public String? Firstname { get; set; }
    public String? Lastname { get; set; }
    public String? Description { get; set; }
}
