namespace CuttingVaultApi.Database.Models
{
    public class AppointmentDbo
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public required UserDbo Stylist { get; set; }
        public String? Style { get; set; }
        public String? Comment { get; set; }
        public int Price { get; set; }
        public ICollection<UserAppointmentDbo> UserAppointments { get; set; }
    }
}
