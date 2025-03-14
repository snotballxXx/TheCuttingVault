﻿// <auto-generated />
using System;
using CuttingVaultApi.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace CuttingVaultApi.Migrations
{
    [DbContext(typeof(CuttingVaultDbContext))]
    [Migration("20250307203936_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("CuttingVaultApi.Database.Models.AppointmentDbo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Comment")
                        .HasColumnType("longtext");

                    b.Property<int?>("CustomerDboId")
                        .HasColumnType("int");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("Price")
                        .HasColumnType("int");

                    b.Property<string>("Style")
                        .HasColumnType("longtext");

                    b.Property<int>("StylistId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CustomerDboId");

                    b.HasIndex("StylistId");

                    b.ToTable("Appointment");
                });

            modelBuilder.Entity("CuttingVaultApi.Database.Models.CustomerDbo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Barcode")
                        .HasColumnType("longtext");

                    b.Property<string>("Comment")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("CreationDate")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("DateOfBirth")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Email")
                        .HasColumnType("longtext");

                    b.Property<string>("FirstName")
                        .HasColumnType("longtext");

                    b.Property<DateTime?>("LastLoyaltyCountUpdate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("LastName")
                        .HasColumnType("longtext");

                    b.Property<DateTime?>("LastUpdate")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("LoyaltyCount")
                        .HasColumnType("int");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("longtext");

                    b.Property<string>("Street")
                        .HasColumnType("longtext");

                    b.Property<string>("Suburb")
                        .HasColumnType("longtext");

                    b.Property<string>("Town")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Customer");
                });

            modelBuilder.Entity("CuttingVaultApi.Database.Models.RefreshTokenDbo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("Expires")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("Revoked")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("RefreshToken");
                });

            modelBuilder.Entity("CuttingVaultApi.Database.Models.UserAppointmentDbo", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int>("AppointmentId")
                        .HasColumnType("int");

                    b.HasKey("UserId", "AppointmentId");

                    b.HasIndex("AppointmentId");

                    b.ToTable("UserAppointment", (string)null);
                });

            modelBuilder.Entity("CuttingVaultApi.Database.Models.UserDbo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<bool>("AccountLocked")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("ChangePassword")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("tinyint(1)")
                        .HasDefaultValue(false);

                    b.Property<string>("Email")
                        .HasColumnType("longtext");

                    b.Property<int>("FailedLoginCount")
                        .HasColumnType("int");

                    b.Property<string>("FirstName")
                        .HasColumnType("longtext");

                    b.Property<DateTime?>("LastLoggin")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("LastName")
                        .HasColumnType("longtext");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("UserName")
                        .IsUnique();

                    b.ToTable("User");
                });

            modelBuilder.Entity("CuttingVaultApi.Database.Models.AppointmentDbo", b =>
                {
                    b.HasOne("CuttingVaultApi.Database.Models.CustomerDbo", null)
                        .WithMany("Appointments")
                        .HasForeignKey("CustomerDboId");

                    b.HasOne("CuttingVaultApi.Database.Models.UserDbo", "Stylist")
                        .WithMany()
                        .HasForeignKey("StylistId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Stylist");
                });

            modelBuilder.Entity("CuttingVaultApi.Database.Models.RefreshTokenDbo", b =>
                {
                    b.HasOne("CuttingVaultApi.Database.Models.UserDbo", "User")
                        .WithMany("RefreshTokens")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("CuttingVaultApi.Database.Models.UserAppointmentDbo", b =>
                {
                    b.HasOne("CuttingVaultApi.Database.Models.AppointmentDbo", "Appointment")
                        .WithMany("UserAppointments")
                        .HasForeignKey("AppointmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CuttingVaultApi.Database.Models.UserDbo", "User")
                        .WithMany("UserAppointments")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Appointment");

                    b.Navigation("User");
                });

            modelBuilder.Entity("CuttingVaultApi.Database.Models.AppointmentDbo", b =>
                {
                    b.Navigation("UserAppointments");
                });

            modelBuilder.Entity("CuttingVaultApi.Database.Models.CustomerDbo", b =>
                {
                    b.Navigation("Appointments");
                });

            modelBuilder.Entity("CuttingVaultApi.Database.Models.UserDbo", b =>
                {
                    b.Navigation("RefreshTokens");

                    b.Navigation("UserAppointments");
                });
#pragma warning restore 612, 618
        }
    }
}
