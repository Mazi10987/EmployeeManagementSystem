using EmployeeManagementAPI.DTOs;
using FluentValidation;

namespace EmployeeManagementAPI.Validators;

public class CreateEmployeeValidator
    : AbstractValidator<CreateEmployeeRequest>
{
    public CreateEmployeeValidator()
    {
        RuleFor(x => x.EmployeeCode)
             .NotEmpty()
             .WithMessage("Employee Code is required")
             .MaximumLength(20);

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("First Name is required")
            .MaximumLength(100);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("Last Name is required")
            .MaximumLength(100);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .WithMessage("Invalid Email Address");

        RuleFor(x => x.Salary)
            .GreaterThan(0)
            .WithMessage("Salary must be greater than 0");

        RuleFor(x => x.DateOfJoining)
            .LessThanOrEqualTo(DateTimeOffset.UtcNow)
            .WithMessage("Date Of Joining cannot be future date");
    }

}