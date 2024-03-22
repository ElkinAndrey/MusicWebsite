namespace MusicWebsiteAPI.DTO
{
    public sealed record class UpdateSongDto(string Name, int Duration, Guid GenreId);
}
