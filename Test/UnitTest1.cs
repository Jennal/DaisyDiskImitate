using System;
using DiskUsage;
using NUnit.Framework;

namespace Test
{
    public class Tests : IProgressUpdater
    {
        private DiskItem _diskItem;
        
        [SetUp]
        public void Setup()
        {
            _diskItem = new DiskItem(@"C:\android", this);
        }

        [Test]
        public void Test1()
        {
            _diskItem.FillSize().Wait();
            _diskItem.Print();
            Console.WriteLine($"{_diskItem.IsFilled} {_diskItem.Progress}");
            
            Assert.Pass();
        }

        public void Update()
        {
            Console.WriteLine($"{_diskItem.IsFilled} {_diskItem.Progress}");
        }
    }
}