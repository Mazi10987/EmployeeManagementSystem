using EmployeeManagementAPI.DTOs;
using EmployeeManagementAPI.Entities;

namespace EmployeeManagementAPI.Services;

public interface IEmployeeService
{
    Task<List<Employee>> GetAllAsync();

    Task<Employee?> GetByIdAsync(int id);

    Task<EmployeeResponse> CreateAsync(CreateEmployeeRequest employee);

    Task UpdateAsync(int id,
                 UpdateEmployeeRequest request);

    Task DeleteAsync(int id);
}