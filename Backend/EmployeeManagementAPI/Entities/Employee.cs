namespace EmployeeManagementAPI.Entities
{
    public class Employee
    {
        public int Id { get; set; }

        public string EmployeeCode { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public DateTimeOffset DateOfJoining { get; set; }

        public decimal Salary { get; set; }
    }
}
