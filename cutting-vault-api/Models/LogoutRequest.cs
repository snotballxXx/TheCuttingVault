namespace CuttingVaultApi.Models
{
    public class LogoutRequest
    {
        public required String UserName { get; set; }

        public override string ToString() => $"{nameof(UserName)}:{UserName}";
    }
}
