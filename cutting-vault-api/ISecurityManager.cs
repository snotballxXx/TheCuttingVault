using CuttingVaultApi.Database.Models;

namespace CuttingVaultApi
{
    public interface ISecurityManager
    {
        String GetEncryptedPassword(String password);

        RefreshTokenDbo GenerateRefreshToken();

        bool VerifyPassword(string password, string hash);

        String GetToken(String userName);
    }
}
