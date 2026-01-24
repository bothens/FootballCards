namespace Domain_Layer.Entities
{
    public sealed class User
    {
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? ImageUrl { get; set; }
        public string UserRole { get; set; } = "user";


        //public ICollection<Portfolio> Portfolios { get; set; } = new List<Portfolio>();
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
