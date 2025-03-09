using CuttingVaultApi.Models;

namespace CuttingVaultApi.Database.Models
{
    public class UserAppointmentDbo
    {
        public int UserId { get; set; }
        public required UserDbo User { get; set; }
        public int AppointmentId { get; set; }
        public required AppointmentDbo Appointment { get; set; }
    }
}
