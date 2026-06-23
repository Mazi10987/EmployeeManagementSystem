using AutoMapper;
using EmployeeManagementAPI.DTOs;
using EmployeeManagementAPI.Entities;
using EmployeeManagementAPI.Repositories;
using FluentValidation;
using EmployeeManagementAPI.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace EmployeeManagementAPI.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repository;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateEmployeeRequest> _validator;
    private readonly ILogger<EmployeeService> _logger;
    private readonly IHubContext<NotificationHub> _hubContext;

    public EmployeeService(IEmployeeRepository repository, IMapper mapper, IValidator<CreateEmployeeRequest> validator,
         ILogger<EmployeeService> logger, IHubContext<NotificationHub> hubContext)
    {
        _repository = repository;
        _mapper = mapper;
        _validator = validator;
        _logger = logger;
        _hubContext = hubContext;
    }

    public async Task<List<Employee>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Employee?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<EmployeeResponse> CreateAsync(CreateEmployeeRequest request)
    {

        _logger.LogInformation(
    "Creating employee {EmployeeCode}",
    request.EmployeeCode);

        var validationResult =
        await _validator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(
                validationResult.Errors);
        }
        // Business Logic Example
        var employee = _mapper.Map<Employee>(request);

        employee.DateOfJoining =
            employee.DateOfJoining.ToUniversalTime();

        _logger.LogInformation(
    "Employee created successfully");

        var employee1 = await _repository.AddAsync(employee);

        await _hubContext.Clients.All.SendAsync(
            "EmployeeCreated",
            employee.FirstName + " " + employee.LastName);

        return _mapper.Map<EmployeeResponse>(employee1);
    }

    public async Task UpdateAsync(
        int id,
        UpdateEmployeeRequest request)
    {
        var employee =
            await _repository.GetByIdAsync(id);

        if (employee == null)
            throw new Exception("Employee not found");

        _mapper.Map(request, employee);

        employee.DateOfJoining =
            employee.DateOfJoining.ToUniversalTime();

        await _repository.UpdateAsync(employee);
    }

    public async Task DeleteAsync(int id)
    {
        var employee =
            await _repository.GetByIdAsync(id);

        if (employee == null)
            throw new Exception("Employee not found");

        await _repository.DeleteAsync(employee);
    }
}