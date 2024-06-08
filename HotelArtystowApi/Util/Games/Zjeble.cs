using HotelArtystowApi.Models.Entity;
using Microsoft.Extensions.FileSystemGlobbing;
using Microsoft.Extensions.FileSystemGlobbing.Abstractions;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace HotelArtystowApi.Util.Games;

public class Zjeble
{

    private String imgPath = "Resources/Images/Zjeble/";

    public async Task<Image> BlurImageAsync(String imgName, int blurStrength)
    {
        Image image = await Image.LoadAsync($"{imgPath}{imgName}");

        image.Mutate(x => x.GaussianBlur(blurStrength));

        return image;
    }

    public MemoryStream ImageToWebpStream(Image image)
    {
        MemoryStream stream = new MemoryStream();

        image.SaveAsWebp(stream);
        stream.Position = 0;
        return stream;
    }

    public String GetNextImagePath(ZjebleRound round)
    {

        Matcher matcher = new Matcher();
        matcher.AddInclude($"*_{round.Id + 1}.jpg");

        PatternMatchingResult result = matcher.Execute(new DirectoryInfoWrapper(new DirectoryInfo(imgPath)));

        if(result.HasMatches)
        {
            return result.Files.First().Path;
        }

        return "";
    }

    public async Task<Image> GetClearImage(String imgName)
    {
        Image image = await Image.LoadAsync($"{imgPath}{imgName}");

        return image;
    }
}
