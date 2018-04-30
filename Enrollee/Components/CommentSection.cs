using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Enrollee.Data;
using Enrollee.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Enrollee.Components
{
    public class CommentSection : ViewComponent
    {

        //private readonly EnrolleeDbContext _context;
        //private readonly UserManager<ApplicationUser> _userManager;

        //public CommentSection(EnrolleeDbContext context, UserManager<ApplicationUser> userManager)
        //{
        //    _context = context;
        //    _userManager = userManager;
        //}

        public IViewComponentResult Invoke()
        {
            return View("CommentSectionComponentView");
        }

    }
}
