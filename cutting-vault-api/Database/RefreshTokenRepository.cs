using CuttingVaultApi.Database.Models;

namespace CuttingVaultApi.Database
{
    public class RefreshTokenRepository : Repository<RefreshTokenDbo>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(CuttingVaultDbContext context) : base(context) { }
    }
}
