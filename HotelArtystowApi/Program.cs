using MySqlConnector;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options => {
            options.ExpireTimeSpan = TimeSpan.FromMinutes(10);
            options.LoginPath = null;
            options.LogoutPath = null;
            options.Events.OnRedirectToLogin = context => 
            {
                context.Response.StatusCode = 401;
                return Task.CompletedTask;
            };
        });

String? connectionString = builder.Configuration.GetConnectionString("Default");

if(connectionString is null)
    throw new Exception("Default database connection string is null");

builder.Services.AddMySqlDataSource(connectionString);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
