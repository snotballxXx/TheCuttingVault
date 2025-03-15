using CuttingVaultApi.Database;
using CuttingVaultApi.Database.Models;
using CuttingVaultApi.Models;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CuttingVaultApi.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly ILogger<CustomerController> _logger;

        public CustomerController(ILogger<CustomerController> logger, ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomerPage([FromQuery] int pageNumber, [FromQuery] int itemsPerPage, string orderBy, bool ascending)
        { 
            try
            {
                var list = await _customerRepository.GetPageAsync(pageNumber, itemsPerPage, orderBy, ascending);
                return Ok(list);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting customers {ex}");
                return StatusCode(503, "Service Unavailable. Please try again later.");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var customer = await _customerRepository.GetByIdAsync(id);
                if (customer == null)
                    return NotFound();

                return Ok(customer);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting customers {ex}");
                return StatusCode(503, "Service Unavailable. Please try again later.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CustomerDbo newItem)
        {
            try
            {
                if (newItem == null)
                {
                    return BadRequest();
                }

                newItem.CreationDate = DateTime.Now;
                _customerRepository.Insert(newItem);
                await _customerRepository.SaveAsync();
                return Ok(newItem);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating customer {ex}");
                return StatusCode(503, "Service Unavailable. Please try again later.");
            }
        }

        [HttpPut()]
        public async Task<IActionResult> Update([FromBody] CustomerDbo value)
        {
            try
            {
                var customer = await _customerRepository.GetByIdAsync(value.Id);
                if (customer == null)
                    return NotFound();

                _customerRepository.Update(customer.Update(value));
                await _customerRepository.SaveAsync();
                return Ok(customer);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating customer {ex}");
                return StatusCode(503, "Service Unavailable. Please try again later.");
            }
        }

        [HttpPut("loyalty/{id}")]
        public async Task<IActionResult> UpdateLoyaltyCount([FromRoute] int id, [FromQuery] int value)
        {
            try
            {
                var customer = await _customerRepository.GetByIdAsync(id);
                if (customer == null)
                    return NotFound();

                customer.LoyaltyCount = value;
                customer.LastUpdate = customer.LastLoyaltyCountUpdate = DateTime.Now;

                _customerRepository.Update(customer);
                await _customerRepository.SaveAsync();
                return Ok(customer);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating customer {ex}");
                return StatusCode(503, "Service Unavailable. Please try again later.");
            }
        }

        [HttpPut("comment")]
        public async Task<IActionResult> UpdateComment([FromBody] CustomerDbo customerUpdate)
        {
            try
            {
                var customer = await _customerRepository.GetByIdAsync(customerUpdate.Id);
                if (customer == null)
                    return NotFound();

                customer.Comment = customerUpdate.Comment;
                customer.LastUpdate = DateTime.Now;

                _customerRepository.Update(customer);
                await _customerRepository.SaveAsync();
                return Ok(customer);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating customer comment {ex}");
                return StatusCode(503, "Service Unavailable. Please try again later.");
            }
        }

        [HttpDelete()]
        public async Task<IActionResult> Delete([FromQuery] string ids)
        {
            try
            {
                if (ids == null)
                {
                    _logger.LogError($"No ids in delete request");
                    return BadRequest();
                }

                var idNumbers = ids.Split('-')
                    .ToList()
                    .Select(e => int.Parse(e))
                    .ToArray();

                if (idNumbers != null)
                {
                    _customerRepository.DeleteRange(idNumbers);
                    await _customerRepository.SaveAsync();
                    return Ok();
                }
                _logger.LogError($"No ids in delete request after process");
                return BadRequest();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting customer {ex}");
                return StatusCode(503, "Service Unavailable. Please try again later.");
            }
        }
    }
}
