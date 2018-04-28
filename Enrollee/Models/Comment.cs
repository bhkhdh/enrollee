using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Enrollee.Models
{
    public class Comment
    {
        public int CommentId { get; set; }
        public Guid UserId { get; set; }
        public string Text { get; set; }
        public DateTime DateTime { get; set; }
    }
}
