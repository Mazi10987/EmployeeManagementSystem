using AutoMapper;
using EmployeeManagementAPI.DTOs;
using EmployeeManagementAPI.Entities;

namespace EmployeeManagementAPI.Mappings;

public class EmployeeProfile : Profile
{
    public EmployeeProfile()
    {
        CreateMap<CreateEmployeeRequest, Employee>();
        CreateMap<UpdateEmployeeRequest, Employee>();

        CreateMap<Employee, EmployeeResponse>()
            .ForMember(
                dest => dest.FullName,
                opt => opt.MapFrom(
                    src => $"{src.FirstName} {src.LastName}"
                ));
    }
}