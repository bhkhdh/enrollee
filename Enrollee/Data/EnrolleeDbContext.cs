﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Enrollee.Models;

namespace Enrollee.Data
{
    public class EnrolleeDbContext : IdentityDbContext<ApplicationUser>
    {
        public EnrolleeDbContext(DbContextOptions<EnrolleeDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);

            //Define PK for Comment
            //builder.Entity<Comment>().HasKey(c => c.UserId);
       
        }


        public DbSet<Comment> Comments { get; set; }
    }
}
