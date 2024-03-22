using System.Data.SqlClient;
using System.Data;

namespace MusicWebsiteAPI.ADO
{

    /// <summary>
    /// Выполенине запростов к базе данных
    /// </summary>
    public class SqlQueries
    {
        /// <summary>
        /// Объект для доступа к базе данных
        /// </summary>
        private SqlConnection connection;

        /// <summary>
        /// Конструктор
        /// </summary>
        public SqlQueries(IConfiguration configuration)
        {
            string connectionString = configuration.GetSection("AppSettings:ConnectionString").Value!;
            connection = new SqlConnection(connectionString);
        }

        public DataTable QuerySelect(
            string queryString,
            IEnumerable<SqlValues> sqlParametes = null!)
        {
            Console.WriteLine(queryString);
            SqlDataAdapter adapter = new SqlDataAdapter(queryString, connection);
            if (sqlParametes is not null)
                foreach (SqlValues sqlParamete in sqlParametes)
                    adapter.SelectCommand.Parameters.AddWithValue(sqlParamete.Name, sqlParamete.Value);
            DataSet ds = new DataSet();
            adapter.Fill(ds);
            return ds.Tables[0];
        }

        public int QueryChanges(
            string queryString,
            IEnumerable<SqlValues> sqlParametes = null!)
        {
            Console.WriteLine(queryString);
            int numberCompletedRequests = 0;
            connection.Open();
            using (SqlCommand cmd = new SqlCommand(queryString, connection))
            {
                if (sqlParametes is not null)
                    foreach (SqlValues sqlParamete in sqlParametes)
                        cmd.Parameters.AddWithValue(sqlParamete.Name, sqlParamete.Value);
                numberCompletedRequests = cmd.ExecuteNonQuery();
            }
            connection.Close();
            return numberCompletedRequests;
        }
    }
}
