using CuttingVaultApi.Database.Models;

namespace CuttingVaultApi.Database
{
    public interface IUserRepository : IRepository<UserDbo>
    {
        UserDbo GetUser(string username);
        Task<UserDbo> GetUserAsync(string username);
        UserDbo GetUserByToken(string token);
        Task<UserDbo> GetUserByTokenAsync(string token);
    }
}
