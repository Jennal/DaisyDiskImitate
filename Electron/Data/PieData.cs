using System.Collections.Generic;
using Newtonsoft.Json;

namespace DaisyDiskImitate.Data
{
    [JsonObject]
    public class PieDataItem
    {
        public string name;
        public string size;
        public float y;
        public List<PieDataItem> children;
    }
    
    [JsonObject]
    public class PieData
    {
        public string title;
        public string totalSize;
        public List<PieDataItem> data;
    }
}