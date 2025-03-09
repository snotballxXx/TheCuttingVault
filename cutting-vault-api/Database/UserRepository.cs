using CuttingVaultApi.Database.Models;
using CuttingVaultApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CuttingVaultApi.Database
{
    public class UserRepository : Repository<UserDbo>, IUserRepository
    {
        public UserRepository(CuttingVaultDbContext context) : base(context) { }

        public Task<UserDbo> GetUserAsync(string username)
        {
            return _DbSet.Where(e => e.UserName == username).FirstOrDefaultAsync(); 
        }

        public UserDbo GetUser(string username)
        {
            return _DbSet.Where(e => e.UserName == username).FirstOrDefault();
        }

        public UserDbo GetUserByToken(string token)
        {
            return _DbSet.Where(e => e.RefreshTokens.Any(t => t.Token == token && t.Revoked == null && t.Expires > DateTime.UtcNow)).FirstOrDefault();
        }
        public Task<UserDbo> GetUserByTokenAsync(string token)
        {
            return _DbSet.Where(e => e.RefreshTokens.Any(t => t.Token == token && t.Revoked == null && t.Expires > DateTime.UtcNow)).FirstOrDefaultAsync();
        }
    }
}
