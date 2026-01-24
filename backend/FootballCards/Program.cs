using System.Text;
using Application_Layer.Common.Interfaces;
using Application_Layer.Features.Auth.Commands.Register;
using Application_Layer.Services;
using FootballCards.API.Extensions;
using FootballCards.API.Middleware;
using FootballCards.Extensions;
using Infrastructure_Layer;
using Infrastructure_Layer.Auth;
using Infrastructure_Layer.Repositories.Implementations;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseFootballCardsSerilog(builder.Configuration);

builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

builder.Services.AddControllers();
builder.Services.AddFootballCardsSwagger();
builder.Services.AddFootballCardsApplicationInsights(builder.Configuration);

builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(RegisterCommand).Assembly));

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddCors(options =>
{
    // Policy som tillåter ALLT (kan användas för test)
    options.AddPolicy("Frontend", policy =>
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());

    // Policy som tillåter bara frontend på localhost:5173
    options.AddPolicy("AllowFrontend", policy =>
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

builder.Services.AddJwtAuthentication(builder.Configuration);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var key = builder.Configuration["Jwt:Key"] ?? builder.Configuration["Jwt:Secret"];
    var issuer = builder.Configuration["Jwt:Issuer"];
    var audience = builder.Configuration["Jwt:Audience"];

    if (string.IsNullOrWhiteSpace(key))
        throw new InvalidOperationException("Jwt:Key/Jwt:Secret saknas i appsettings.json");
    if (string.IsNullOrWhiteSpace(issuer))
        throw new InvalidOperationException("Jwt:Issuer saknas i appsettings.json");
    if (string.IsNullOrWhiteSpace(audience))
        throw new InvalidOperationException("Jwt:Audience saknas i appsettings.json");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
        ClockSkew = TimeSpan.FromSeconds(30)
    };
});

builder.Services.AddAuthorization();

builder.Services.AddTransient<ExceptionMiddleware>();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "FootballCards API v1");
    c.RoutePrefix = "swagger";
});

app.MapGet("/", () => Results.Redirect("/swagger"));

app.UseSerilogRequestLogging();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}


app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
