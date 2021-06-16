using System;
using System.Collections.Generic;
using System.Linq;

namespace DiskUsage
{
    public enum FileType{
        File,
        Directory
    }

    public class DiskItem
    {
        public FileType Type;
        public string FullPath;
        
        /// <summary>
        /// byte
        /// </summary>
        public long Size;

        public List<DiskItem> Children;
        public DiskItem Parent;

        public void Print(int intend=0)
        {
            for (var i = 0; i < intend; i++)
            {
                Console.Write("  ");
            }
            var t = Type == FileType.Directory ? "D" : "F";
            Console.WriteLine($"\\[{t}] {FullPath}: {Size}");
            if (Children == null) return;
            
            foreach (var child in Children.OrderByDescending(o => o.Size).ThenBy(o => o.Type).ThenBy(o => o.FullPath))
            {
                child.Print(intend+1);
            }
        }
    }
}
