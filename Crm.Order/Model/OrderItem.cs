namespace Crm.Order.Model
{
	using System;

	using Crm.Article.Model;
	using Crm.Article.Model.Enums;
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;

	[Serializable]
	public class OrderItem : EntityBase<Guid>, IExportable, ISoftDelete
	{
		public virtual Guid OrderId { get; set; }
		//public virtual Order Order { get; set; }
		public virtual string LegacyId { get; set; }
		public virtual string Position { get; set; }
		public virtual Guid ArticleId { get; set; }
		public virtual string ArticleNo { get; set; }
		public virtual string ArticleDescription { get; set; }
		public virtual string CustomDescription { get; set; }
		public virtual string CustomArticleNo { get; set; }
		public virtual string AdditionalInformation { get; set; }
		public virtual decimal QuantityValue { get; set; }
		public virtual DateTime? DeliveryDate { get; set; }
		public virtual string QuantityUnitKey { get; set; }
		public virtual bool IsAccessory { get; set; }
		public virtual bool IsAlternative { get; set; }
		public virtual bool IsCarDump { get; set; }
		public virtual bool IsExported { get; set; }
		public virtual bool IsOption { get; set; }
		public virtual bool IsSample { get; set; }
		/// <summary>
		/// Determines if the item was part of a bigger set, and were removed from the set
		/// on immediate need. No stock checks are done for this item.
		/// </summary>
		public virtual bool IsRemoval { get; set; }
		public virtual bool IsSerial { get; set; }
		public virtual decimal Price { get; set; }
		public virtual decimal? PurchasePrice { get; set; }
		public virtual decimal CalculatedPrice
		{
			get { return IsSample ? 0 : Price * QuantityValue; }
		}
		public virtual decimal CalculatedPriceWithDiscount
		{
			get { return CalculatedPrice - (DiscountType == DiscountType.Absolute ? Discount * QuantityValue : Discount / 100 * CalculatedPrice); }
		}
		public virtual decimal Discount { get; set; }
		public virtual DiscountType DiscountType { get; set; }

		public virtual Article Article { get; set; }

		public virtual Guid? ParentOrderItemId { get; set; }

		public virtual string VATLevelKey
		{
			get { return Article == null ? "" : Article.VATLevelKey; }
		}
	}
}