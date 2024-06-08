using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using MySqlConnector;

using HotelArtystowApi.Models.Entity;
using HotelArtystowApi.Models.Repository;

namespace HotelArtystowApi.Controllers;

[ApiController]
[Route("users")]
public class UsersController : ControllerBase
{
    private readonly MySqlDataSource _mysql;

    public UsersController([FromServices] MySqlDataSource mysql)
    {
        _mysql = mysql; 
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] UserLoginDTO userLogin)
    {
        PasswordHasher<User> hasher = new PasswordHasher<User>();
        UserRepository userRepository = new UserRepository(_mysql);

        User? user = await userRepository.GetBy("username", userLogin.Username);

        if(user is null)
            return NotFound("Login not found");

        PasswordVerificationResult res = hasher.VerifyHashedPassword(user, user.Password!, userLogin.Password);

        switch(res)
        {
            case PasswordVerificationResult.Success:

                UserStatisticsRepository statisticsRepository = new UserStatisticsRepository(_mysql);
                UserStatistics stats = (await statisticsRepository.GetBy("userId", user.Id))!;

                stats.User.Value = user;

                await statisticsRepository.UpdateLoginStreak(stats);

                user.LastLogin = DateTime.Now;
                await userRepository.Update(user);

                AuthorizeUser(userLogin.Username);
                HttpContext.Session.SetInt32("userId", (int)user.Id);
                return Ok(new Dictionary<String, dynamic> {{"status", true}, {"userId", user.Id}});
            case PasswordVerificationResult.Failed:
                return Unauthorized("Invalid password");
        }

        return Ok();
    }

    async private void AuthorizeUser(String username)
    {
        List<Claim> claims = new List<Claim>()
        {
            new Claim(ClaimTypes.Name, username)
        };

        ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        AuthenticationProperties auth = new AuthenticationProperties 
        {
            AllowRefresh = true
        };

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), auth);
    }

    [HttpGet("logout")]
    public async Task<ActionResult> Logout()
    {
        await HttpContext.SignOutAsync();
        return Ok();
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] UserRegisterDTO userRegister)
    {
        User user = userRegister.MakeUser();
        Console.WriteLine(user.ToString());

        UserRepository userRepository = new UserRepository(_mysql);
        bool res = await userRepository.CreateUser(user);
        if(res)
            return Ok();
        else
            return StatusCode(500);
    }

    [HttpGet("getUsers")]
    [Authorize]
    public async Task<IEnumerable<User>> GetUsers()
    {
        UserRepository userRepository = new UserRepository(_mysql);
        IReadOnlyList<User> usersList = await userRepository.GetAllUsers();

        return usersList.ToArray();
    }

    [HttpGet("profile/{id}")]
    public async Task<ActionResult<UserProfileDTO>> Profile(int id)
    {
        UserRepository userRepository = new UserRepository(_mysql);
        User? user = await userRepository.GetBy("id", id);

        if(user is null)
            return NotFound();

        UserStatisticsRepository statisticsRepository = new UserStatisticsRepository(_mysql);
        UserStatistics statistics = (await statisticsRepository.GetBy(new Dictionary<String, dynamic?>() {{"userId", user.Id}})).First();

        UserProfileDTO profileDTO = user.ToDTO<UserProfileDTO>();

        profileDTO.UserStatistics = statistics;

        return Ok(profileDTO);
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<UserProfileDTO>> MyProfile()
    {
        UserRepository userRepository = new UserRepository(_mysql);
        User? user = await userRepository.GetBy("id", HttpContext.Session.GetInt32("userId")!);

        if(user is null)
            return NotFound("Could not find profile with this session id");

        UserStatisticsRepository statisticsRepository = new UserStatisticsRepository(_mysql);
        UserStatistics statistics = (await statisticsRepository.GetBy(new Dictionary<String, dynamic?>() {{"userId", user.Id}})).First();


        UserProfileDTO profile = user.ToDTO<UserProfileDTO>();
        profile.UserStatistics = statistics;

        return Ok(profile);
    }

    [HttpPost("profile/saveDescription")]
    [Authorize]
    public async Task<ActionResult> SaveDescription([FromBody] String value)
    {
        UserRepository userRepository = new UserRepository(_mysql);
        User? user = await userRepository.GetBy("id", HttpContext.Session.GetInt32("userId")!);

        if(user is null)
            return NotFound("Could not find profile with this session id");

        user.Description = value;
        if(await userRepository.Update(user))
            return Ok();

        return StatusCode(500);
    }

    [HttpGet("profile/getNavbarStats")]
    [Authorize]
    public async Task<ActionResult<UserNavbarDTO>> GetNavbarStats()
    {
        int userId = (int)HttpContext.Session.GetInt32("userId")!;

        UserStatisticsRepository statisticsRepository = new UserStatisticsRepository(_mysql);

        UserStatistics stats = (await statisticsRepository.GetBy("userId", userId))!;

        UserNavbarDTO dto = stats.ToDTO<UserNavbarDTO>();

        return Ok(dto);
    }
}
