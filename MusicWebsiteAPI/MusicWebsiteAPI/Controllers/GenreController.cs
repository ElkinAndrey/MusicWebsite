using Microsoft.AspNetCore.Mvc;
using MusicWebsiteAPI.ADO;
using MusicWebsiteAPI.DTO;
using MusicWebsiteAPI.Entities;
using System.Data;

namespace MusicWebsiteAPI.Controllers
{
    [ApiController]
    [Route("api/genres")]
    public class GenreController : ControllerBase
    {
        private readonly SqlQueries sqlQueries;

        public GenreController(SqlQueries sqlQueries)
        {
            this.sqlQueries = sqlQueries;
        }

        [HttpPost("")]
        public IActionResult Create(CreateGenreDto request)
        {
            string query = @$"
                INSERT INTO [Genre] ([Name]) 
                VALUES (@name)
            ";
            var parameters = new List<SqlValues>()
            {
                new SqlValues { Name = "@name", Value = request.Name },
            };
            sqlQueries.QueryChanges(query, parameters);
            return Ok();
        }

        [HttpGet("")]
        public IActionResult Read()
        {
            string query = @$"
                SELECT [Id], [Name]
                FROM [Genre]
            ";
            DataTable dataTable = sqlQueries.QuerySelect(query);

            var genres = new List<Genre>();
            foreach (DataRow row in dataTable.Rows)
                genres.Add(GetGenreByRow(row));
            return Ok(genres);
        }

        [HttpPut("{id}")]
        public IActionResult Update(Guid id, UpdateGenreDto request)
        {
            string query = @$"
                UPDATE [Genre] 
                SET [Name]=@name
                WHERE [Id]=@id
            ";
            var parameters = new List<SqlValues>()
            {
                new SqlValues { Name = "@id", Value = id },
                new SqlValues { Name = "@name", Value = request.Name },
            };
            sqlQueries.QueryChanges(query, parameters);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            string query = @$"
                DELETE FROM [Genre] 
                WHERE [Id] = @id     
            ";
            var parameters = new List<SqlValues>()
            {
                new SqlValues { Name = "@id", Value = id },
            };
            sqlQueries.QueryChanges(query, parameters);
            return Ok();
        }

        private Genre GetGenreByRow(DataRow row)
            => new Genre
            {
                Id = row.Field<Guid>("Id"),
                Name = row.Field<string>("Name") ?? "",
            };
    }
}
