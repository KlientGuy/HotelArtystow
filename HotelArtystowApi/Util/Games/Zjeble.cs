using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace HotelArtystowApi.Util.Games;

public class Zjeble
{
    public async Task<Image> BlurImageAsync(String path, int blurStrength)
    {
        Image image = await Image.LoadAsync(path);

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
}
