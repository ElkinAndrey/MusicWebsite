namespace MusicWebsiteAPI.Entities
{
    public class Song
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public int Duration { get; set; } = 0;
        public Genre Genre { get; set; } = null!;
    }
}
