using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Enrollee.Controllers
{
    public class QuestController : Controller {
        public IActionResult Game1() {
            return View();
        }

        public IActionResult Game2() {
            return View();
        }

        public IActionResult Game3() {
            return View();
        }
    }
}