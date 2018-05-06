using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Enrollee.Data;
using Enrollee.Models;
using Enrollee.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using Npgsql;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Security.Cryptography.X509Certificates;

namespace Enrollee
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var connstr = new NpgsqlConnectionStringBuilder(Configuration["Database:ConnectionString"]) {
                Password = Configuration["Database:Password"],
                SslMode = SslMode.Require,
                TrustServerCertificate = true,
                UseSslStream = true,
            };

            services.AddDbContext<EnrolleeDbContext>(options => {
                var conn = new NpgsqlConnection(connstr.ConnectionString);
                conn.ProvideClientCertificatesCallback += certs => {
                    certs.Add(new X509Certificate2(Configuration["Database:CertificateFile"]));
                };

                options.UseNpgsql(conn);
            });

            services.AddIdentity<ApplicationUser, IdentityRole>(options => {
                    options.Password.RequireDigit = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                })
                .AddEntityFrameworkStores<EnrolleeDbContext>()
                .AddDefaultTokenProviders();

            //Google authentification
            services.AddAuthentication().AddGoogle(googleOptions =>
            {
                googleOptions.ClientId = Configuration["Authentication:Google:ClientId"];
                googleOptions.ClientSecret = Configuration["Authentication:Google:ClientSecret"];
            });

            // Add application services.
            services.AddTransient<IEmailSender, EmailSender>();

            //Override User claims for accessing custom properties
            services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, MyUserClaimsPrincipalFactory>();

            services.AddMvc();
            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(new RequireHttpsAttribute());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }


            var options = new RewriteOptions().AddRedirectToHttps();
            app.UseRewriter(options);

            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
