using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace DiskUsage
{
    public class DiskUsageProcessor
    {
        public DiskItem Root;
        
        public async Task Start(string path)
        {
            Root = CreateItem(path);
            await FillItem(Root);
        }

        private DiskItem CreateItem(string path)
        {
            var attr = File.GetAttributes(path);
            if (attr.HasFlag(FileAttributes.Directory))
            {
                return new DiskItem
                {
                    Type = FileType.Directory,
                    FullPath = path,
                    Children = new List<DiskItem>()
                };
            }

            return new DiskItem
            {
                Type = FileType.File,
                FullPath = path
            };
        }

        private async Task FillItem(DiskItem item)
        {
            if (item.Type == FileType.Directory)
            {
                await FillDirectory(item);
            }
            else
            {
                await FillFile(item);
            }
        }

        private async Task FillDirectory(DiskItem item)
        {
            var files = Directory.GetFiles(item.FullPath);
            var dirs = Directory.GetDirectories(item.FullPath);

            var tasks = new List<Task>();
            
            foreach (var file in files)
            {
                var fItem = new DiskItem
                {
                    Type = FileType.File,
                    FullPath = file,
                    Parent = item,
                };
                item.Children.Add(fItem);

                tasks.Add(FillFile(fItem));
            }

            foreach (var dir in dirs)
            {
                var dItem = new DiskItem
                {
                    Type = FileType.Directory,
                    FullPath = dir,
                    Parent = item,
                    Children = new List<DiskItem>(),
                };
                item.Children.Add(dItem);
                
                tasks.Add(FillDirectory(dItem));
            }
            
            await Task.WhenAll(tasks.ToArray());
            
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

                if (item.Parent != null)
                {
                    lock (item.Parent)
                    {
                        item.Parent.Size += item.Size;
                    }
                }
            });
        }
    }
}