using Microsoft.AspNetCore.Mvc;
using MusicWebsiteAPI.ADO;
using MusicWebsiteAPI.DTO;
using System.Data;
using MusicWebsiteAPI.Entities;

namespace MusicWebsiteAPI.Controllers
{
    [ApiController]
    [Route("api/songs")]
    public class SongController : ControllerBase
    {
        private readonly SqlQueries sqlQueries;

        public SongController(SqlQueries sqlQueries)
        {
            this.sqlQueries = sqlQueries;
        }

        [HttpPost("")]
        public IActionResult Create(CreateSongDto request)
        {
            string query = @$"
                INSERT INTO [Song] ([Name], [Duration], [GenreId])
                VALUES (@name, @duration, @genreId)
            ";
            var parameters = new List<SqlValues>()
            {
                new SqlValues { Name = "@name", Value = request.Name },
                new SqlValues { Name = "@duration", Value = request.Duration },
                new SqlValues { Name = "@genreId", Value = request.GenreId },
            };
            sqlQueries.QueryChanges(query, parameters);
            return Ok();
        }

        [HttpGet("")]
        public IActionResult Read()
        {
            string query = @$"
                SELECT 
                    [Song].[Id],
                    [Song].[Name],
                    [Song].[Duration],
                    [Genre].[Id] AS [GenreId],
		            [Genre].[Name] AS [GenreName]
                FROM [Song]
	            LEFT JOIN [Genre] ON 
		            [Genre].[Id]=[Song].[GenreId]
            ";
            DataTable dataTable = sqlQueries.QuerySelect(query);
            var songs = new List<Song>();
            foreach (DataRow row in dataTable.Rows)
                songs.Add(GetSongByRow(row));
            return Ok(songs);
        }

        [HttpGet("{id}")]
        public IActionResult ReadById(Guid id)
        {
            string query = @$"
                SELECT 
                    [Song].[Id],
                    [Song].[Name],
                    [Song].[Duration],
                    [Genre].[Id] AS [GenreId],
		            [Genre].[Name] AS [GenreName]
                FROM [Song]
	            LEFT JOIN [Genre] ON 
		            [Genre].[Id]=[Song].[GenreId]
                WHERE [Song].[Id] = @id
            ";
            var parameters = new List<SqlValues>()
            {
                new SqlValues { Name = "@id", Value = id }
            };
            DataTable dataTable = sqlQueries.QuerySelect(query, parameters);
            var song = GetSongByRow(dataTable.Rows[0]);
            return Ok(song);
        }

        [HttpGet("{id}/singers")]
        public IActionResult ReadSingers(Guid id)
        {
            string query = @$"
                SELECT 
                    [Singer].[Id],
                    [Singer].[Name],
                    [Singer].[Description]
                FROM [SongSinger]
                LEFT JOIN [Singer] ON 
	                [SongSinger].[SingerId]=[Singer].[Id]
                WHERE [SongSinger].[SongId] = @songId
            ";
            var parameters = new List<SqlValues>()
            {
                new SqlValues { Name = "@songId", Value = id }
            };
            DataTable dataTable = sqlQueries.QuerySelect(query, parameters);
            var singers = new List<Singer>();
            foreach (DataRow row in dataTable.Rows)
                singers.Add(GetSingerByRow(row));
            return Ok(singers);
        }


        [HttpPut("{id}")]
        public IActionResult Update(Guid id, UpdateSongDto request)
        {
            string query = @$"
                UPDATE [Song] 
                SET [Name]=@name, [Duration]=@duration, [GenreId]=@genreId
                WHERE [Id]=@id
            ";
            var parameters = new List<SqlValues>()
            {
                new SqlValues { Name = "@id", Value = id },
                new SqlValues { Name = "@name", Value = request.Name },
                new SqlValues { Name = "@duration", Value = request.Duration },
                new SqlValues { Name = "@genreId", Value = request.GenreId },
            };
            sqlQueries.QueryChanges(query, parameters);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            string query = @$"
                DELETE FROM [Song] 
                WHERE [Id] = @id
            ";
            var parameters = new List<SqlValues>()
            {
                new SqlValues { Name = "@id", Value = id },
            };
            sqlQueries.QueryChanges(query, parameters);
            return Ok();
        }

        [HttpPut("{id}/singers/add")]
        public IActionResult AddSinger(Guid id, AddSingerToSongDto request)
        {
            string query = @$"
                INSERT INTO [SongSinger] ([SongId], [SingerId])
                VALUES (@songId, @singerId)
            ";
            var parameters = new List<SqlValues>()
            {
                new SqlValues { Name = "@songId", Value = id },
                new SqlValues { Name = "@singerId", Value = request.SingerId },
            };
            sqlQueries.QueryChanges(query, parameters);

            return Ok();
        }

        [HttpPut("{id}/singers/delete")]
        public IActionResult DeleteSinger(Guid id, DeleteSingerFromSongDto request)
        {
            string query = @$"
                DELETE FROM [SongSinger] 
                WHERE [SongId]=@songId AND [SingerId]=@singerId
            ";
            var parameters = new List<SqlValues>()
            {
                new SqlValues { Name = "@songId", Value = id },
                new SqlValues { Name = "@singerId", Value = request.SingerId },
            };
            sqlQueries.QueryChanges(query, parameters);
            return Ok();
        }

        private Song GetSongByRow(DataRow row)
            => new Song
            {
                Id = row.Field<Guid>("Id"),
                Name = row.Field<string>("Name") ?? "",
                Duration = row.Field<int>("Duration"),
                Genre = new Genre
                {
                    Id = row.Field<Guid>("GenreId"),
                    Name = row.Field<string>("GenreName") ?? "",
                }
            };

        private Singer GetSingerByRow(DataRow row) => new Singer
        {
            Id = row.Field<Guid>("Id"),
            Name = row.Field<string>("Name") ?? "",
            Description = row.Field<string>("Description") ?? "",
        };
    }
}
