using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Enrollee.Models;
using Enrollee.Data;

namespace Enrollee.Controllers
{
    public class HomeController : Controller
    {
        private readonly EnrolleeDbContext _context;

        public HomeController(EnrolleeDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            //var pageSize = 10;
            //var comments = _context.Comments.Select(c => c);
            //return View(await PaginatedList<Comment>.CreateAsync(comments.AsNoTracking(), page ?? 1, pageSize));
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
