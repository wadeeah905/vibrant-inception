using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LMobile.Gen3LicenseManagement.Portal.BusinessObjects {
	public class TreeWrapper<TNode, TChild> {
		public bool Expanded;
		public TNode Node;
		public List<TChild> Children;
	}
}
