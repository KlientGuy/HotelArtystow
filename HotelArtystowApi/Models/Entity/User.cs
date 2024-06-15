using Microsoft.AspNetCore.Identity;

using HotelArtystowApi.Util.Database;

namespace HotelArtystowApi.Models.Entity;

public sealed class User : AbstractEntity
{
    public String? Username { get; set; }
    public String? Password { get; set; }
    public String? Firstname { get; set; }
    public String? Lastname { get; set; }
    public String? Description { get; set; }
    public String? ProfilePic { get; set; }
    public DateTime? LastLogin { get; set; }
    public ReverseRelation<UserStatistics> UserStatistics { get; set; } = new ReverseRelation<UserStatistics>(0, null);
}

public class UserRegisterDTO
{
    public required String Username { get; set; }
    public required String Password { get; set; }
    public required String Firstname { get; set; }
    public required String Lastname { get; set; }

    public User MakeUser()
    {
        User user = new User();
        user.Username = Username;
        user.Firstname = Firstname;
        user.Lastname = Lastname;

        PasswordHasher<User> hasher = new PasswordHasher<User>();
        String hashedPassword = hasher.HashPassword(user, Password);

        user.Password = hashedPassword;

        return user;
    }
}

public class UserLoginDTO
{
    public required String Username { get; set; }
    public required String Password { get; set; }
}

public class UserProfileDTO : AbstractDTO
{
    public String? Firstname { get; set; }
    public String? Lastname { get; set; }
    public String? Description { get; set; }
    public String? ProfilePic { get; set; }
    public UserStatistics? UserStatistics { get; set; }
}
