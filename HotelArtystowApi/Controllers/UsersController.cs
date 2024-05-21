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
                return Ok(new Dictionary<String, dynamic> {{"status", true}, {"redirect", "adam"}});
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
        String username = ((JsonElement)registerBody["username"]).GetString() ?? "";

        if(username == "")
            return BadRequest("Username is a required field");

        String password = ((JsonElement)registerBody["password"]).GetString() ?? "";

        if(password == "")
            return BadRequest("Password is a required field");

        User user = new User();
        user.Username = username;

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

    [HttpPost("new")]
    public async Task<ActionResult> New()
    {
        UserRepository userRepository = new UserRepository(_mysql);
        User user = new User();
        user.Username = "adam.adam";
        bool res = await userRepository.CreateUser(user);

        if(res)
            return CreatedAtAction(nameof(GetUsers), null, user);

        return StatusCode(500);
    }
}
