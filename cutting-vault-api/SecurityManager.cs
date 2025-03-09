using CuttingVaultApi.Database.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace CuttingVaultApi
{
    public class SecurityManager : ISecurityManager
    {
        private readonly int _jwtTtl;
        private readonly string? _securityKey;
        private readonly string? _issuer;
        private readonly string? _audience;

        public SecurityManager(IConfiguration configuration)
        {
            _jwtTtl = configuration.GetValue<int>("security:jwtTtlInMinutes", defaultValue: 300);
            _securityKey = configuration.GetValue<string>("security:key");
            _issuer = configuration.GetValue<string>("security:issuer");
            _audience = configuration.GetValue<string>("security:audience");

            if (_securityKey == null || _issuer == null || _audience == null)
                throw new NullReferenceException("seurity keys not found");
        }

        public string GetEncryptedPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }

        public RefreshTokenDbo GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);

                return new RefreshTokenDbo { Token = Convert.ToBase64String(randomBytes), Expires = DateTime.UtcNow.AddDays(7), Created = DateTime.Now };
            }
        }

        public string GetToken(string userName)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_securityKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(_jwtTtl),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
