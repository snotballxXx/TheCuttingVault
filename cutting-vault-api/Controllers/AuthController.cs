using CuttingVaultApi.Database;
using CuttingVaultApi.Database.Models;
using CuttingVaultApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CuttingVaultApi.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly IUserRepository _userRepo;
        private readonly ISecurityManager _securityManager;
        private readonly IRefreshTokenRepository _refeshTokenRepository;
        private readonly int? _lockOutCount;

        public AuthController(ILogger<AuthController> logger, IConfiguration configuration, 
            IUserRepository userRepo,
            ISecurityManager securityManager,
            IRefreshTokenRepository refeshTokenRepository)
        {
            _logger = logger;
            _userRepo = userRepo;
            _securityManager = securityManager;
            _refeshTokenRepository = refeshTokenRepository;

            _lockOutCount = configuration.GetValue<int>("security:lockoutCount", defaultValue: 3);
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            try
            {
                var refreshToken = Request.Cookies["refreshToken"];
                if (refreshToken == null)
                {
                    _logger.LogError($"Error in refresh request no cookie");
                    return Unauthorized();
                }

                var user = await _userRepo.GetUserByTokenAsync(refreshToken);
                if (user == null)
                {
                    _logger.LogError($"Error in refresh request");
                    return Unauthorized();
                }

                var newRefreshToken = _securityManager.GenerateRefreshToken();
                _refeshTokenRepository.DeleteRange(user.RefreshTokens.ToArray());
                user.RefreshTokens.Add(newRefreshToken);
                _userRepo.Update(user);
                await _userRepo.SaveAsync();

                SetTokenCookie(newRefreshToken);

                var jwtToken = _securityManager.GetToken(user.UserName);
                return Ok(new { token = jwtToken });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in refresh request  {ex}");
                return Unauthorized();
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Models.LoginRequest request)
        {
            try
            {
                var connection = $"{this.HttpContext.Connection.RemoteIpAddress}:{this.HttpContext.Connection.RemotePort}";

                _logger.LogDebug($"Login attempt: {request} {connection}");

                var user = await _userRepo.GetUserAsync(request.UserName.ToLower());
                if (user == null)
                {
                    _logger.LogDebug($"Login failure incorrect user name");
                    return Unauthorized();
                }

                if (user.AccountLocked)
                {
                    _logger.LogDebug($"Login failure on locked account");
                    return Unauthorized();
                }

                if (_securityManager.VerifyPassword(request.Password, user.Password))
                {
                    _logger.LogDebug($"Login success");

                    user.LastLoggin = DateTime.Now;
                    user.FailedLoginCount = 0;
                    var newRefreshToken = _securityManager.GenerateRefreshToken();
                    user.RefreshTokens.Add(newRefreshToken);

                    _userRepo.Update(user);
                    await _userRepo.SaveAsync();
                    SetTokenCookie(newRefreshToken);

                    var token = _securityManager.GetToken(request.UserName);
                    return Ok(new { token, user });
                }

                user.FailedLoginCount++;
                if (user.FailedLoginCount > _lockOutCount)
                {
                    _logger.LogDebug($"Login failure locking account");
                    user.FailedLoginCount = 0;
                    user.AccountLocked = true;
                }

                _userRepo.Update(user);
                await _userRepo.SaveAsync();

                _logger.LogDebug($"Login failure incorrect password");
                return Unauthorized();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in Login : {request} {ex}");
                return Unauthorized();
            }
        }

        [Authorize]
        [HttpPut("logout")]
        public ActionResult Logout([FromBody] LogoutRequest request)
        {
            try
            {
                _logger.LogDebug($"Logout: {request}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in logout : {request} {ex}");
                return StatusCode(503, "Service Unavailable. Please try again later.");
            }

            return Ok();
        }

        [Authorize]
        [HttpPut("changePwd")]
        public async Task<ActionResult> ChangePassword([FromBody] Models.PasswordUpdate request)
        {
            try
            {
                _logger.LogDebug($"Password change attempt: {request}");

                var user = await _userRepo.GetUserAsync(request.UserName.ToLower());

                if (user == null)
                {
                    _logger.LogDebug($"Password change incorrect user name: {request}");
                    return Unauthorized();
                }

                if (_securityManager.VerifyPassword(request.OldPassword, user.Password))
                {
                    _logger.LogDebug($"Password changed: {request}");
                    user.Password = _securityManager.GetEncryptedPassword(request.NewPassword);
                    user.ChangePassword = false;

                    _userRepo.Update(user);
                    await _userRepo.SaveAsync();
                    return Ok();
                }

                _logger.LogDebug($"Password change failure incorrect password: {request}");
                return Unauthorized();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in Password change : {request} {ex}");
                return StatusCode(503, "Service Unavailable. Please try again later.");
            }
        }

        private void SetTokenCookie(RefreshTokenDbo token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = false,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", token.Token, cookieOptions);
        }
    }
}
