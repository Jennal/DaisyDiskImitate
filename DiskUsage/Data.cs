using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

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

        /// <summary>
        /// is size filled
        /// </summary>
        public bool IsFilled;

        public List<DiskItem> Children;
        public DiskItem Parent;

        private IProgressUpdater _progressUpdater;
        
        #region For Human Readable

        const long K = 1024;
        const long M = 1048576;
        const long G = 1073741824;
        const long T = 1099511627776;
        const long P = 1125899906842624;

        private static readonly Dictionary<long, string> s_sizeDict = new()
        {
            {P, "P"},
            {T, "T"},
            {G, "G"},
            {M, "M"},
            {K, "K"},
        };

        #endregion        
        
        public string HumanReadableSize
        {
            get
            {
                foreach (var item in s_sizeDict)
                {
                    if (Size >= item.Key) return $"{(double)Size/item.Key:F1} {item.Value}";
                }

                return $"{Size} B";
            }
        }
        
        public float Progress
        {
            get
            {
                if (IsFilled) return 1f;
                
                if (Type == FileType.File)
                {
                    return 0f;
                }

                if (Children is not {Count: > 0}) return 0f;
                return Children.Sum(o => o.Progress) / Children.Count;
            }
        }

        private DiskItem()
        {   
        }

        public DiskItem(string path, IProgressUpdater updater=null)
        {
            var attr = File.GetAttributes(path);
            
            Type = attr.HasFlag(FileAttributes.Directory) ? FileType.Directory : FileType.File;
            FullPath = path;
            _progressUpdater = updater;
        }
        
        public async Task FillSize()
        {
            if (Type == FileType.Directory)
            {
                await FillDirectory(this);
            }
            else
            {
                await FillFile(this);
            }
        }

        private async Task FillDirectory(DiskItem item)
        {
            var files = Directory.GetFiles(item.FullPath);
            var dirs = Directory.GetDirectories(item.FullPath);

            var tasks = new List<Task>();
            var children = new List<DiskItem>();
            
            foreach (var file in files)
            {
                var fItem = new DiskItem
                {
                    Type = FileType.File,
                    FullPath = file,
                    Parent = item,
                    _progressUpdater = _progressUpdater,
                };
                children.Add(fItem);
            }

            foreach (var dir in dirs)
            {
                var dItem = new DiskItem
                {
                    Type = FileType.Directory,
                    FullPath = dir,
                    Parent = item,
                    _progressUpdater = _progressUpdater,
                };
                children.Add(dItem);
            }

            Children = children;
            foreach (var child in Children)
            {
                tasks.Add(child.FillSize());
            }
            
            await Task.WhenAll(tasks.ToArray());
            item.IsFilled = true;
            _progressUpdater?.Update();
            
            if (item.Parent != null)
            {
                lock (item.Parent)
                {
                    item.Parent.Size += item.Size;
                }
            }
        }

        private Task FillFile(DiskItem item)
        {
            return Task.Run(() =>
            {
                var info = new FileInfo(item.FullPath);
                item.Size = info.Length;
                item.IsFilled = true;
                _progressUpdater?.Update();

                if (item.Parent != null)
                {
                    lock (item.Parent)
                    {
                        item.Parent.Size += item.Size;
                    }
                }
            });
        }
        
        public void Print(int intend=0)
        {
            for (var i = 0; i < intend; i++)
            {
                Console.Write("  ");
            }
            var t = Type == FileType.Directory ? "D" : "F";
            Console.WriteLine($"\\[{t}] {FullPath}: {HumanReadableSize}");
            if (Children == null) return;
            
            foreach (var child in Children.OrderByDescending(o => o.Size).ThenBy(o => o.Type).ThenBy(o => o.FullPath))
            {
                child.Print(intend+1);
            }
        }
        
        public void RawPrint(int intend=0)
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
                child.RawPrint(intend+1);
            }
        }
    }
}
