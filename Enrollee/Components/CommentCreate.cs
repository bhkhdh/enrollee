using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Enrollee.Components
{
    public class CommentCreate : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View("CommentCreateComponentView");
        }
    }
}
