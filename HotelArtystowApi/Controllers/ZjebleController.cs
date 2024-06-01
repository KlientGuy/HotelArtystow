using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

using HotelArtystowApi.Models.Entity;
using HotelArtystowApi.Models.Repository;

namespace HotelArtystowApi.Controllers;

[ApiController]
[Route("zjeble")]
public class ZjebleController : ControllerBase
{
    private readonly MySqlDataSource _mysql;

    public ZjebleController([FromServices] MySqlDataSource mysql)
    {
        _mysql = mysql; 
    }

    [HttpGet("getUserSession")]
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
            session.StartedAt = DateTime.Now;
            session.LivesLeft = 3;
            session.UserId = userId;
            session.Round = new Util.Database.Relation<ZjebleRound>(round.Id, round);

            await repository.Create(session);
        }

        return Ok(session);
    }

    [HttpPost("submitAnswer")]
    public async Task<ActionResult> SubmitAnswer([FromBody] String answer) 
    {
        ZjebleRoundRepository roundRepository = new ZjebleRoundRepository(_mysql);
        ZjebleRound round = await roundRepository.GetLatest();
        int userId = (int)HttpContext.Session.GetInt32("userId")!;
        ZjebleUserSessionRepository sessionRepository = new ZjebleUserSessionRepository(_mysql);
        ZjebleUserSession session = (await sessionRepository.GetBy("userId", userId))!;
        Dictionary<String, dynamic> response;

        if(answer != round.Answer)
        {
            session.LivesLeft--;

            if(session.LivesLeft == 0)
                session.EndedAt = DateTime.Now;

            response = new Dictionary<String, dynamic>() {
                {"status", false},
                {"message", "Próbuj dalej"}
            };


        }
        else
        {
            session.EndedAt = DateTime.Now;
            response = new Dictionary<String, dynamic>() {
                {"status", true},
                {"message", "Gratulacje użytkowniku"},
            };
        }

        await sessionRepository.Update(session);

        return Ok(response);
    }

}
