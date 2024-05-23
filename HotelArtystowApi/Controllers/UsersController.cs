using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;
using MySqlConnector;

using HotelArtystowApi.Models.Entity;
using HotelArtystowApi.Models.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;

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
    public async Task<ActionResult> Login([FromBody] Dictionary<String, dynamic> loginBody)
    {
        String username = ((JsonElement)loginBody["username"]).GetString() ?? "";

        if(username == "")
            return BadRequest("Username is a required field");

        String password = ((JsonElement)loginBody["password"]).GetString() ?? "";

        if(password == "")
            return BadRequest("Password is a required field");

        PasswordHasher<User> hasher = new PasswordHasher<User>();

        UserRepository userRepository = new UserRepository(_mysql);

        User? user = await userRepository.GetBy("username", username);

        if(user is null)
        {
            return NotFound("Login not found");
        }

        PasswordVerificationResult res = hasher.VerifyHashedPassword(user, user.Password!, password);

        switch(res)
        {
            case PasswordVerificationResult.Success:
                AuthorizeUser(username);
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
    public async Task<ActionResult> Register([FromBody] Dictionary<String, dynamic> registerBody)
    {
        String[] errorMsg = [];
        String username = ((JsonElement)registerBody["username"]).GetString() ?? "";

        if(username == "")
            errorMsg.Append("username");

        String password = ((JsonElement)registerBody["password"]).GetString() ?? "";

        if(password == "")
            errorMsg.Append("password");

        String firstname = ((JsonElement)registerBody["firstname"]).GetString() ?? "";
        String lastname = ((JsonElement)registerBody["lastname"]).GetString() ?? "";

        if(firstname == "" || lastname == "")
        {
            errorMsg.Append("firstname").Append("lastname");
            return BadRequest($"Following fields are required: {String.Join(", ", errorMsg)}");
        }

        User user = new User();
        user.Username = username;
        user.Firstname = firstname;
        user.Lastname = lastname;

        PasswordHasher<User> hasher = new PasswordHasher<User>();

        String hashedPassword = hasher.HashPassword(user, password);

        user.Password = hashedPassword;
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
    public async Task<ActionResult> Profile(int id)
    {
        UserRepository userRepository = new UserRepository(_mysql);
        User? user = await userRepository.GetBy("id", id);

        if(user is null)
            return NotFound();

        user.Password = null;
        return Ok(user.ToDictionary());
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult> MyProfile()
    {
        UserRepository userRepository = new UserRepository(_mysql);
        User? user = await userRepository.GetBy("id", HttpContext.Session.GetInt32("userId")!);

        if(user is null)
            return NotFound("Could not find profile with this session id");

        user.Password = null;
        return Ok(user.ToDictionary());
    }

    public async Task<ActionResult> SaveDescription([FromBody] String value)
    {
        UserRepository userRepository = new UserRepository(_mysql);
        User? user = await userRepository.GetBy("id", HttpContext.Session.GetInt32("userId")!);

        if(user is null)
            return NotFound("Could not find profile with this session id");

        user.Description = value;

        return Ok();
    }
}
