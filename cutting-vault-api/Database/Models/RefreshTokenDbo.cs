namespace CuttingVaultApi.Database.Models
{
    public class RefreshTokenDbo
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public DateTime Expires { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public DateTime Created { get; set; }
        public DateTime? Revoked { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;

        public int UserId { get; set; } // Foreign key
        public UserDbo User { get; set; }
    }

}
