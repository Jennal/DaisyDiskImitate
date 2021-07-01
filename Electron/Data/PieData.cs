using System.Collections.Generic;
using Newtonsoft.Json;

namespace DaisyDiskImitate.Data
{
    [JsonObject(MemberSerialization.OptOut)]
    public class PieDataItem
    {
        public string name;
        [JsonIgnore] public long size;
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