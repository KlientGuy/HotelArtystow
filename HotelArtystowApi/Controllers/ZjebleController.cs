using HotelArtystowApi.Models.Entity;
using HotelArtystowApi.Models.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace HotelArtystowApi.Controllers;

[ApiController]
[Route("/zjeble")]
public class ZjebleController : ControllerBase
{
    private readonly MySqlDataSource _mysql;

    public ZjebleController([FromServices] MySqlDataSource mysql)
    {
        _mysql = mysql; 
    }

    [HttpGet("/getUserSession")]
    [Authorize]
    public async Task<ActionResult> GetUserSession()
    {
        int userId = (int)HttpContext.Session.GetInt32("userId")!;

        ZjebleUserSessionRepository repository = new ZjebleUserSessionRepository(_mysql);
        ZjebleRoundRepository roundRepository = new ZjebleRoundRepository(_mysql);

        ZjebleRound round = await roundRepository.GetLatest();
        ZjebleUserSession? session = await repository.GetBy("userId", userId);

        if(session is not null)
        {
            session.Round.Value = round;
        }
        else
        {
            session = new ZjebleUserSession();
            session.StartedAt = new DateTime();
            session.LivesLeft = 3;
            session.UserId = userId;
            session.Round = new Util.Database.Relation<long, ZjebleRound>(round.Id, round);

            await repository.Create(session);
        }
        return Ok();

    }

}
