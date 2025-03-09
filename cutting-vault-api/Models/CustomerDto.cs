namespace CuttingVaultApi.Models
{
    public class CustomerDto
    {
        public int Id { get; set; }
        public String? FirstName { get; set; }
        public String? LastName { get; set; }
        public String? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public String? Email { get; set; }
        public String? Barcode { get; set; }
        public String? Street { get; set; }
        public String? Town { get; set; }
        public String? Suburb { get; set; }
        public String? Comment { get; set; }
        public int LoyaltyCount { get; set; }
        public DateTime? LastLoyaltyCountUpdate { get; set; }
    }
}
