using CuttingVaultApi.Database;
using CuttingVaultApi.Database.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;
using System.Security;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CuttingVaultApi.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UserController> _logger;
        private readonly ISecurityManager _securityManager;

        public UserController(ILogger<UserController> logger, IUserRepository userRepository, ISecurityManager securityManager)
        {
            _userRepository = userRepository;
            _logger = logger;
            _securityManager = securityManager;
        }

        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] AddUserRequest request)
        {
            try
            {
                var newUser = new UserDbo() 
                {
                    UserName = request.UserName,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    Password = _securityManager.GetEncryptedPassword(request.Password)
                };

                _userRepository.Insert(newUser);
                await _userRepository.SaveAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting users {ex}");
                return StatusCode(503, "Service Unavailable. Please try again later.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUserPage([FromQuery] int pageNumber,
            [FromQuery] int itemsPerPage,
            [FromQuery] string orderBy,
            [FromQuery] bool ascending,
            [FromQuery] string? filters = null)
        {
            try
            {
                Expression<Func<UserDbo, string>> orderByFunc = (e) => e.UserName;
                var list = await _userRepository.GetPageAsync(pageNumber, itemsPerPage, orderBy, ascending, filters);
                return Ok(list);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting customers {ex}");
                return StatusCode(503, "Service Unavailable. Please try again later.");
            }
        }
    }
}