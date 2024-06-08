using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using SixLabors.ImageSharp;

using HotelArtystowApi.Models.Entity;
using HotelArtystowApi.Models.Repository;
using HotelArtystowApi.Util.Games;

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
    public async Task<ActionResult<ZjebleUserSessionClearDTO>> GetUserSession()
    {
        int userId = (int)HttpContext.Session.GetInt32("userId")!;

        ZjebleUserSessionRepository repository = new ZjebleUserSessionRepository(_mysql);
        ZjebleRoundRepository roundRepository = new ZjebleRoundRepository(_mysql);

        ZjebleRound round = await roundRepository.GetLatest();
        ZjebleUserSession? session = (await repository.GetBy(new Dictionary<String, dynamic?>() {{"userId", userId}, {"round", round.Id}})).FirstOrDefault();

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

        return Ok(session.ToDTO<ZjebleUserSessionClearDTO>());
    }

    [HttpPost("submitAnswer")]
    public async Task<ActionResult> SubmitAnswer([FromBody] String answer) 
    {
        ZjebleRoundRepository roundRepository = new ZjebleRoundRepository(_mysql);
        ZjebleRound round = await roundRepository.GetLatest();

        int userId = (int)HttpContext.Session.GetInt32("userId")!;

        ZjebleUserSessionRepository sessionRepository = new ZjebleUserSessionRepository(_mysql);
        ZjebleUserSession? session = (await sessionRepository.GetBy(new Dictionary<String, dynamic?>() {{"userId", userId}, {"round", round.Id}}))!.FirstOrDefault();

        Dictionary<String, dynamic> response;

        if(session is null)
        {
            response = new Dictionary<String, dynamic>() {
                {"status", false},
                {"message", "Nie znaleziono wygenerowanej sesji"},
                {"noAction", 1}
            };
            return NotFound(response);
        }

        if(session.EndedAt is not null && session.LivesLeft <= 0)
        {
            response = new Dictionary<String, dynamic>() {
                {"status", false},
                {"message", "Nie możesz już zgadywać, wyczerpałeś wszystkie życia ;("},
                {"noAction", 1}
            };
            return Ok(response);
        }
        else if(session.EndedAt is not null)
        {
            response = new Dictionary<String, dynamic>() {
                {"status", false},
                {"message", "Już zgadłeś, czego tu jeszcze szukasz?"},
                {"noAction", 1}
            };
            return Ok(response);
        }

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

            UserStatisticsRepository statisticsRepository = new UserStatisticsRepository(_mysql);
            UserStatistics stats = (await statisticsRepository.GetBy("userId", userId))!;
            stats.Bees += session.LivesLeft * 10;
            await statisticsRepository.Update(stats);
        }

        await sessionRepository.Update(session);

        return Ok(response);
    }

    [HttpGet("getImageForUser")]
    [Authorize]
    public async Task<ActionResult> getImageForUser()
    {
        int userId = (int)HttpContext.Session.GetInt32("userId")!;

        ZjebleRoundRepository roundRepository = new ZjebleRoundRepository(_mysql);
        ZjebleRound round = await roundRepository.GetLatest();
        ZjebleUserSessionRepository sessionRepository = new ZjebleUserSessionRepository(_mysql);

        Dictionary<String, dynamic?> searchQuery = new Dictionary<String, dynamic?>() {
            {"userId", userId},
            {"round", round.Id}
        };

        ZjebleUserSession session = (await sessionRepository.GetBy(searchQuery))!.First();

        Zjeble zjeble = new Zjeble();

        Image image = (session.EndedAt is null) ? await zjeble.BlurImageAsync(round.PicturePath!, session.LivesLeft * 5) : await zjeble.GetClearImage(round.PicturePath!);
        return File(zjeble.ImageToWebpStream(image), "image/webp");
    }

    [HttpPost("createTodaysRound")]
    public async Task<ActionResult<ZjebleRound>> CreateTodaysRound()
    {
        ZjebleRoundRepository roundRepository = new ZjebleRoundRepository(_mysql);

        ZjebleRound round = await roundRepository.GetLatest();

        if(round.createdAt.DayOfYear == DateTime.Now.DayOfYear)
        {
            return StatusCode(418, "Todays round already exists");
        }

        Zjeble zjeble = new Zjeble();
        String path = zjeble.GetNextImagePath(round);

        round = new ZjebleRound();
        round.Answer = path.Substring(0, path.LastIndexOf('_')).ToLower();
        round.PicturePath = path;
        round.createdAt = DateTime.Now;

        await roundRepository.Create(round);

        return Ok(round);
    }
}
