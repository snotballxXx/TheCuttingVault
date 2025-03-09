using CuttingVaultApi.Database.Models;

namespace CuttingVaultApi.Database
{
    public class CustomerRepository : Repository<CustomerDbo>, ICustomerRepository
    {
        public CustomerRepository(CuttingVaultDbContext context) : base(context) { }
    }
}
