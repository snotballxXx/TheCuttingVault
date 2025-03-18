using CuttingVaultApi.Database.Models;

namespace CuttingVaultApi.Database
{
    public class CustomerRepository : Repository<CustomerDbo>, ICustomerRepository
    {
        public CustomerRepository(CuttingVaultDbContext context, ILogger<CustomerRepository> logger) : base(context, logger) { }
    }
}
