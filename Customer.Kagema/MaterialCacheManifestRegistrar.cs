using Crm.Library.Modularization.Interfaces;
using Crm.Library.Offline;
using Crm.Library.Offline.Interfaces;

namespace Customer.Kagema
{
    public class MaterialCacheManifestRegistrar : CacheManifestRegistrar<MaterialCacheManifest>
    {
        public MaterialCacheManifestRegistrar(IPluginProvider pluginProvider)
            : base(pluginProvider)
        {
        }
        protected override void Initialize()
        {
            CacheJs("customerJs");
        }
    }
}
