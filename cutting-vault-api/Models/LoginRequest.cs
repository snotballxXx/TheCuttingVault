namespace CuttingVaultApi.Models
{
    public class LoginRequest
    {
        public required String UserName { get; set; }
        public required String Password { get; set; }

        public override string ToString() => $"{nameof(UserName)}:{UserName}, {nameof(Password)}:{Password}";
    }
}
