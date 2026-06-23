using EmployeeManagementAPI.Data;
using EmployeeManagementAPI.Mappings;
using EmployeeManagementAPI.Middleware;
using EmployeeManagementAPI.Repositories;
using EmployeeManagementAPI.Services;
using EmployeeManagementAPI.Validators;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Serilog;
using EmployeeManagementAPI.Hubs;


internal class Program
{
    private static void Main(string[] args)
    {

        Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File(
        "Logs/log-.txt",
        rollingInterval: RollingInterval.Day)
    .CreateLogger();

        var builder = WebApplication.CreateBuilder(args);
        builder.Host.UseSerilog();

        // Add services to the container.
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition("Bearer",
                new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter JWT Token"
                });

            options.AddSecurityRequirement(
      new OpenApiSecurityRequirement
      {
            {
                new OpenApiSecurityScheme
                {
                    Reference =
                        new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                },
                Array.Empty<string>()
            }
      });
        });

        builder.Services.AddControllers();
        builder.Services.AddSignalR();

        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddAutoMapper(
            typeof(EmployeeProfile));

        builder.Services.AddValidatorsFromAssemblyContaining<CreateEmployeeValidator>();

        builder.Services.AddScoped<IEmployeeRepository,
                                   EmployeeRepository>();

        builder.Services.AddScoped<IEmployeeService,
                                   EmployeeService>();

        builder.Services
.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer =
                builder.Configuration["Jwt:Issuer"],

            ValidAudience =
                builder.Configuration["Jwt:Audience"],


            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        builder.Configuration["Jwt:Key"]!))
        };
});
        builder.Services.AddCors(options =>
        {   
            options.AddPolicy(
                "AngularPolicy",
                policy =>
                {
                    policy
 .WithOrigins("http://localhost:4200")
 .AllowAnyHeader()
 .AllowAnyMethod()
 .AllowCredentials();
                });
        });

        builder.Services.AddAuthorization();

        var app = builder.Build();


        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseMiddleware<ExceptionMiddleware>();

        app.UseHttpsRedirection();

        app.UseCors("AngularPolicy");

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        app.MapHub<NotificationHub>("/notificationHub");

        app.Run();
    }
}