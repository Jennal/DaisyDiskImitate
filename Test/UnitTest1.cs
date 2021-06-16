using DiskUsage;
using NUnit.Framework;

namespace Test
{
    public class Tests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void Test1()
        {
            var processor = new DiskUsageProcessor();
            processor.Start(@"E:\Work\Codes\github\jennal\DaisyDiskImitate").Wait();
            processor.Root.Print();
            
            Assert.Pass();
        }
    }
}