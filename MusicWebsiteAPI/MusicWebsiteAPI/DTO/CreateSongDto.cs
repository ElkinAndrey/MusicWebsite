namespace MusicWebsiteAPI.DTO
{
    public sealed record class CreateSongDto(string Name, int Duration, Guid GenreId);
}
