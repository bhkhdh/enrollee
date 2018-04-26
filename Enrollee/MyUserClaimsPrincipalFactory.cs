using Enrollee.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Enrollee
{
    public class MyUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser, IdentityRole>
    {
        public MyUserClaimsPrincipalFactory(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IOptions<IdentityOptions> optionsAccessor) : base(userManager, roleManager, optionsAccessor)
        {
        }

        public async override Task<ClaimsPrincipal> CreateAsync(ApplicationUser user)
        {
            var principal = await base.CreateAsync(user);

            //Putting our Property to Claims
            if(!string.IsNullOrWhiteSpace(user.GivenName))
                ((ClaimsIdentity)principal.Identity).AddClaims(
                    new[] 
                    {
                        new Claim(ClaimTypes.GivenName, user.GivenName)
                    }
                );

            return principal;
        }
    }
}
