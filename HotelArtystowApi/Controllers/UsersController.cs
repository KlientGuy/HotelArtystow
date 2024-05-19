using Microsoft.AspNetCore.Mvc;
using HotelArtystowApi.Models.Entity;
using HotelArtystowApi.Models.Repository;
using MySqlConnector;

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

    [HttpGet("getUsers")]
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
