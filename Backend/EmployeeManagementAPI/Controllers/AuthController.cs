using EmployeeManagementAPI.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(
        IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("login")]
    public IActionResult Login(
        LoginRequest request)
    {
        if (request.UserName != "admin" ||
            request.Password != "admin123")
        {
            return Unauthorized();
        }

        var token = GenerateToken(request);

        return Ok(new { token });
    }

    private string GenerateToken(LoginRequest request)
    {
        var claims = new[]
        {
        new Claim(
            ClaimTypes.Name,
            request.UserName),

        new Claim(
            ClaimTypes.Role,
            request.Role)
    };

        var key =
             new SymmetricSecurityKey(
                 Encoding.UTF8.GetBytes(
                     _configuration["Jwt:Key"]!));

        var creds =
              new SigningCredentials(
                  key,
                  SecurityAlgorithms.HmacSha256);

        var token =
              new JwtSecurityToken(
                  issuer:
                      _configuration["Jwt:Issuer"],

                  audience:
                      _configuration["Jwt:Audience"],

                  claims: claims,

                  expires:
                      DateTime.UtcNow.AddHours(1),

                  signingCredentials:
                      creds);


        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}