using CuttingVaultApi.Models;
using Mysqlx.Crud;

namespace CuttingVaultApi.Database.Models
{
    public class CustomerDbo
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
        public DateTime? LastUpdate { get; set; }
        public DateTime CreationDate { get; set; }
        public ICollection<AppointmentDbo>? Appointments { get; set; }

        public CustomerDbo()
        {
        }
        public CustomerDbo(CustomerDto src)
        {
            Id = src.Id;
            FirstName = src.FirstName;
            LastName = src.LastName;
            PhoneNumber = src.PhoneNumber;
            DateOfBirth = src.DateOfBirth;
            Email = src.Email;
            Barcode = src.Barcode;
            Street = src.Street;
            Town = src.Town;
            Suburb = src.Suburb;
            Comment = src.Comment;
            LoyaltyCount = src.LoyaltyCount;
            LastLoyaltyCountUpdate = src.LastLoyaltyCountUpdate;
            LastUpdate = DateTime.Now;
        }

        public CustomerDbo Update(CustomerDto src)
        {
            FirstName = src.FirstName;
            LastName = src.LastName;
            PhoneNumber = src.PhoneNumber;
            DateOfBirth = src.DateOfBirth;
            Email = src.Email;
            Barcode = src.Barcode;
            Street = src.Street;
            Town = src.Town;
            Suburb = src.Suburb;
            Comment = src.Comment;
            LoyaltyCount = src.LoyaltyCount;
            LastLoyaltyCountUpdate = src.LastLoyaltyCountUpdate;

            return this;
        }

        public CustomerDbo Update(CustomerDbo src)
        {
            FirstName = src.FirstName;
            LastName = src.LastName;
            PhoneNumber = src.PhoneNumber;
            DateOfBirth = src.DateOfBirth;
            Email = src.Email;
            Barcode = src.Barcode;
            Street = src.Street;
            Town = src.Town;
            Suburb = src.Suburb;
            Comment = src.Comment;
            LoyaltyCount = src.LoyaltyCount;
            LastLoyaltyCountUpdate = src.LastLoyaltyCountUpdate;
            LastUpdate = src.LastUpdate;

            return this;
        }
    }
}
