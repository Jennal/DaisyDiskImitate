using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DiskUsage2
{
    public enum FileType
    {
        File,
        Directory,
    }
    
    public class DiskItem
    {
        public string Path;
        public FileType Type;
        public long Size;
        public bool IsFilled;
        
        public List<DiskItem> Children;
    }

    public class DiskUsage
    {
        public DiskItem Create(string path)
        {
            var attr = File.GetAttributes(path);

            var data = new DiskItem
            {
                Path = path,
                Type = attr.HasFlag(FileAttributes.Directory) ? FileType.Directory : FileType.File,
            };

            if (data.Type == FileType.Directory)
            {
                data.Children = new List<DiskItem>();
                
                var files = Directory.GetFiles(path);
                var dirs = Directory.GetDirectories(path);

                foreach (var file in files)
                {
                    var item = Create(file);
                    data.Children.Add(item);
                }
                
                foreach (var dir in dirs)
                {
                    var item = Create(dir);
                    data.Children.Add(item);
                }
            }

            return data;
        }

        public Task<int> Fill(DiskItem item, Action<float> updater)
        {
            var files = new List<DiskItem>();
            GetAllFiles(item, files);
            var count = files.Count;
            var finishedCount = 0;
            var finished = 0;

            var result = new TaskCompletionSource<int>();
            if (count <= 0)
            {
                result.SetResult(0);
                return result.Task;
            }
            
            foreach (var file in files)
            {
                Task.Run(() =>
                {
                    var fileInfo = new FileInfo(file.Path);
                    file.Size = fileInfo.Length;
                    file.IsFilled = true;
                    
                    Interlocked.Increment(ref finishedCount);
                    updater.Invoke((float)finishedCount / count);

                    if (!item.IsFilled &&
                        Interlocked.CompareExchange(ref finished, 0, 0) <= 0 &&
                        count == Interlocked.CompareExchange(ref finishedCount, 0, 0))
                    {
                        Interlocked.Increment(ref finished);
                        FillDirs(item);
                        result.SetResult(count);
                    }
                });
            }

            return result.Task;
        }

        private void FillDirs(DiskItem item)
        {
            if (item.Type == FileType.File || item.IsFilled) return;

            var pending = new Queue<DiskItem>();
            var dirs = new List<DiskItem>();
            
            pending.Enqueue(item);
            
            GetBFSDirs(pending, dirs);
            foreach (var dir in dirs)
            {
                dir.IsFilled = true;
                dir.Size = dir.Children.Sum(o => o.Size);
            }
        }

        private void GetBFSDirs(Queue<DiskItem> pending, List<DiskItem> results)
        {
            if (pending.Count <= 0)
            {
                results.Reverse();
                return;
            }
            
            var range = new List<DiskItem>();
            while (pending.TryDequeue(out var dir))
            {
                range.Add(dir);
            }
            
            results.AddRange(range);
            foreach (var item in range)
            {
                foreach (var child in item.Children)
                {
                    if (child.Type == FileType.File) continue;
                    pending.Enqueue(child);
                }
            }
            
            GetBFSDirs(pending, results);
        }

        private void GetAllFiles(DiskItem item, List<DiskItem> list)
        {
            if (item.Type == FileType.File)
            {
                list.Add(item);
                return;
            }

            foreach (var child in item.Children)
            {
                GetAllFiles(child, list);
            }
        }
    }
}
