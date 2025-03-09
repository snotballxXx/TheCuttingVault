using System.Text.Json.Serialization;

namespace CuttingVaultApi.Database.Models
{
    public class UserDbo
    {
        public int Id { get; set; }

        public String UserName { get; set; }

        public String? FirstName { get; set; }

        public String? LastName { get; set; }

        public String? Email { get; set; }

        public DateTime? LastLoggin { get; set; }

        [JsonIgnore]
        public String Password { get; set; }

        [JsonIgnore]
        public int FailedLoginCount { get; set; }

        [JsonIgnore]
        public bool AccountLocked { get; set; }

        public bool ChangePassword { get; set; } = false;

        [JsonIgnore]
        public ICollection<UserAppointmentDbo>? UserAppointments { get; set; }

        [JsonIgnore]
        public ICollection<RefreshTokenDbo> RefreshTokens { get; set; } = new List<RefreshTokenDbo>();
    }
}
