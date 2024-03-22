namespace MusicWebsiteAPI.ADO
{
    /// <summary>
    /// Sql параметр
    /// </summary>
    public class SqlValues
    {
        /// <summary>
        /// Имя параметра
        /// </summary>
        public string Name { get; set; } = "";

        /// <summary>
        /// Значение параметра
        /// </summary>
        public object Value { get; set; } = null!;
    }
}
