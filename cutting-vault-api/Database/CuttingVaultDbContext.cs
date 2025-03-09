using CuttingVaultApi.Database.Models;
using Microsoft.EntityFrameworkCore;


namespace CuttingVaultApi.Database
{
    /*
     Add-Migration InitialCreate
     Script-Migration -Output MigrationScript.sql
     
     Rollback to 0
     Script-Migration  -from 20250216001304_InitialCreate -to 0 -Output MigrationScript-down.sql
     */

    public class CuttingVaultDbContext : DbContext
    {
        public CuttingVaultDbContext(DbContextOptions<CuttingVaultDbContext> options)
        : base(options)
        {
        }

        public DbSet<UserDbo> User { get; set; }
        public DbSet<CustomerDbo> Customer { get; set; }
        public DbSet<AppointmentDbo> Appointment { get; set; }
        public DbSet<RefreshTokenDbo> RefreshToken { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserAppointmentDbo>().ToTable("UserAppointment");

            modelBuilder.Entity<UserAppointmentDbo>()
                .HasKey(ua => new { ua.UserId, ua.AppointmentId });

            modelBuilder.Entity<UserDbo>()
                .HasIndex(u => u.UserName)
                .IsUnique();

            modelBuilder.Entity<UserDbo>()
                .Property(u => u.ChangePassword)
                .HasDefaultValue(false);
            /*
                        modelBuilder.Entity<UserDbo>()
                            .Property(u => u.Password)
                            .IsRequired(true);

                        modelBuilder.Entity<UserDbo>()
                            .Property(u => u.UserName)
                            .IsRequired(true);

                        modelBuilder.Entity<UserDbo>()
                            .Property(u => u.FirstName)
                            .IsRequired(false);

                        modelBuilder.Entity<UserDbo>()
                            .Property(u => u.LastName)
                            .IsRequired(false);

                        modelBuilder.Entity<UserDbo>()
                            .Property(u => u.Email)
                            .IsRequired(false);*/

            modelBuilder.Entity<UserDbo>()
                .HasMany(p => p.RefreshTokens)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId );

            modelBuilder.Entity<UserAppointmentDbo>()
                .HasOne(ua => ua.User)
                .WithMany(u => u.UserAppointments)
                .HasForeignKey(ua => ua.UserId);

            modelBuilder.Entity<UserAppointmentDbo>()
                .HasOne(ua => ua.Appointment)
                .WithMany(a => a.UserAppointments)
                .HasForeignKey(ua => ua.AppointmentId);
        }
    }
}
