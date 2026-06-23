using EmployeeManagementAPI.Data;
using EmployeeManagementAPI.DTOs;
using EmployeeManagementAPI.Entities;
using EmployeeManagementAPI.Repositories;
using EmployeeManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;


namespace EmployeeManagementAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : Controller
    {
        private readonly IEmployeeService _service;

        public EmployeeController(IEmployeeService service)
        {
            _service = service;
        }


        // GET: api/employee
        [Authorize(Roles =
      "Admin,Manager,Employee")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeResponse>>> GetEmployees() {

            var employees = await _service.GetAllAsync();

            return Ok(employees);

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeResponse>> GetEmployee(int id)
        {
            var employee = await _service.GetByIdAsync(id);

            if (employee == null)
                return NotFound();

            return Ok(employee);

        }


        [Authorize(Roles =
    "Admin,Manager")]
        [HttpPost]
        public async Task<IActionResult> CreateEmployee(CreateEmployeeRequest employee)
        {
            employee.DateOfJoining =
             employee.DateOfJoining.ToUniversalTime();

            var createdEmployee =
                await _service.CreateAsync(employee);

            return Ok(createdEmployee); ;
        }

        // PUT: api/employee/1
        [Authorize(Roles =
    "Admin,Manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, UpdateEmployeeRequest employee)
        {
            await _service.UpdateAsync(id, employee);

            return NoContent();
        }

        // DELETE: api/employee/1
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee =
           await _service.GetByIdAsync(id);

            if (employee == null)
                return NotFound();

            await _service.DeleteAsync(id);

            return NoContent();
        }

    }
}
