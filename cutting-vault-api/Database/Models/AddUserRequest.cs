﻿namespace CuttingVaultApi.Database.Models
{
    public class AddUserRequest
    {
        public String UserName { get; set; }

        public String? FirstName { get; set; }

        public String? LastName { get; set; }

        public String? Email { get; set; }

        public String Password { get; set; }
    }
}
