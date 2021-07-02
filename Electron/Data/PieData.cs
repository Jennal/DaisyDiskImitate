using System.Collections.Generic;
using System.Linq;
using DiskUsage;
using Newtonsoft.Json;

namespace DaisyDiskImitate.Data
{
    public static class PieDataItemId
    {
        public const int ROOT_ID = 0;
        public const int OUTTER_OTHER_ID = -1;
        public const int INNER_OTHER_ID = -2;
    }
    
    [JsonObject(MemberSerialization.OptOut)]
    public class PieDataItem
    {
        public int baseId;
        public int id;
        public string name;
        [JsonIgnore] public long size;
        public int y;
        public List<PieDataItem> children;

        public PieDataItem Find(int id)
        {
            if (this.id == id) return this;
            if (children == null) return null;

            foreach (var child in children)
            {
                var result = child.Find(id);
                if (result != null) return result;
            }

            return null;
        }
    }
    
    [JsonObject]
    public class PieData
    {
        public int baseId;
        public string title;
        public string totalSize;
        public List<PieDataItem> data;

        public PieData Find(int id)
        {
            foreach (var item in data)
            {
                var result = item.Find(id);
                if (result == null) continue;

                return new PieData
                {
                    baseId = result.children.First().baseId,
                    title = $"{title}\\{result.name}",
                    totalSize = DiskItem.ToHumanReadable(result.size),
                    data = result.children
                };
            }

            return null;
        }
    }
}