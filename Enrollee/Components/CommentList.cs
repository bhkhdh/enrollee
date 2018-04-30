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
    public class CommentList : ViewComponent
    {
        private readonly EnrolleeDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public CommentList(EnrolleeDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public IViewComponentResult Invoke()
        {
            var items = from c in _context.Comments
                        orderby c.DateTime descending
                        select c;
            return View("CommentsPartial",items);
        }
    }
}
