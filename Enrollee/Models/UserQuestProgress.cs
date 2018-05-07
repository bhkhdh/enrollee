using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Enrollee.Models
{
    public class UserQuestProgress
    {
        public int MyProperty { get; set; }

        [Range(0,3)]
        public int ChaptersCompleted { get; set; }

    }
}
