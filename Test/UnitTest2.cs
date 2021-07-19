using System;
using DiskUsage2;
using NUnit.Framework;

namespace Test
{
    public class TestDiskUsage2
    {
        private DiskUsage2.DiskUsage usage = new();
        private DiskUsage2.DiskItem item;
        
        [SetUp]
        public void Setup()
        {
            
        }

        [Test]
        public void Create()
        {
            item = usage.Create(@"C:\android");
            Assert.Pass();
        }

        [Test]
        public void Fill()
        {
            item = usage.Create(@"C:\android");
            var task = usage.Fill(item, val =>
            {
                if (val >= 0.99f) Console.WriteLine($"{val*100:F1}% {item.IsFilled}");
            });

            task.Wait();
            Console.WriteLine($"{item.Size}");
            Assert.Pass();
        }
    }
}