namespace CuttingVaultApi.Models
{
    public class PasswordUpdate
    {
        public required String UserName { get; set; }
        public required String NewPassword { get; set; }
        public required String OldPassword { get; set; }

        public override string ToString() => @$"{nameof(UserName)}:{UserName}, 
            {nameof(NewPassword)}:{NewPassword}, 
            {nameof(NewPassword)}:{NewPassword}";
    }
}
