using Microsoft.AspNetCore.Mvc;
using MusicWebsiteAPI.ADO;
using MusicWebsiteAPI.DTO;
using MusicWebsiteAPI.Entities;
using System.Data;

namespace MusicWebsiteAPI.Controllers
{
    [ApiController]
    [Route("api/singers")]
    public class SingerController : ControllerBase
    {
        private readonly SqlQueries sqlQueries;

        public SingerController(SqlQueries sqlQueries)
        {
            this.sqlQueries = sqlQueries;
        }

        [HttpPost("")]
        public IActionResult Create(CreateSingerDto request)
        {
            string query = @$"
                INSERT INTO [Singer] ([Name], [Description]) 
                VALUES (@name, @description)
            ";
            var parameters = new List<SqlValues>()
            {
                new SqlValues { Name = "@name", Value = request.Name },
                new SqlValues { Name = "@description", Value = request.Description },
            };
            sqlQueries.QueryChanges(query, parameters);
            return Ok();
        }

        [HttpGet("")]
        public IActionResult Read()
        {
            string query = @$"
                SELECT [Id], [Name], [Description]
                FROM [Singer]
            ";
            DataTable dataTable = sqlQueries.QuerySelect(query);
            var singers = new List<Singer>();
            foreach (DataRow row in dataTable.Rows)
                singers.Add(GetSingerByRow(row));
            return Ok(singers);
        }

        [HttpGet("{id}")]
        public IActionResult ReadById(Guid id)
        {
            string query = @$"
                SELECT [Id], [Name], [Description]
                FROM [Singer]
                WHERE [Id] = @id
            ";
            var parameters = new List<SqlValues>()
            {
                new SqlValues { Name = "@id", Value = id! },
            };
            DataTable dataTable = sqlQueries.QuerySelect(query, parameters);
            var singer = GetSingerByRow(dataTable.Rows[0]);
            return Ok(singer);
        }

        [HttpPut("{id}")]
        public IActionResult Update(Guid id, UpdateSingerDto request)
        {
            string query = @$"
                UPDATE [Singer] 
                SET [Name]=@name, [Description]=@description
                WHERE [Id] =@id
            ";
            var parameters = new List<SqlValues>()
            {
                new SqlValues { Name = "@id", Value = id },
                new SqlValues { Name = "@name", Value = request.Name },
                new SqlValues { Name = "@description", Value = request.Description },
            };
            sqlQueries.QueryChanges(query, parameters);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            string query = @$"
                DELETE FROM [Singer] 
                WHERE [Id] = @id     
            ";
            var parameters = new List<SqlValues>()
            {
                new SqlValues { Name = "@id", Value = id },
            };
            sqlQueries.QueryChanges(query, parameters);
            return Ok();
        }

        private Singer GetSingerByRow(DataRow row) => new Singer
        {
            Id = row.Field<Guid>("Id"),
            Name = row.Field<string>("Name") ?? "",
            Description = row.Field<string>("Description") ?? "",
        };
    }
}
