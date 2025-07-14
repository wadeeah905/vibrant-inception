namespace Crm.Order.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120101020000)]
	public class CreateCrmOrderItem : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[OrderItem]"))
			{

				var stringBuilder = new StringBuilder();

				stringBuilder.AppendLine("CREATE TABLE [CRM].[OrderItem] (");
				stringBuilder.AppendLine("[OrderItemId] [int] IDENTITY(1,1) NOT NULL,");
				stringBuilder.AppendLine("[OrderKey] [int] NOT NULL,");
				stringBuilder.AppendLine("[Position] [int] NOT NULL,");
				stringBuilder.AppendLine("[ArticleKey] [int] NOT NULL,");
				stringBuilder.AppendLine("[ArticleNo] [nvarchar](50) NOT NULL,");
				stringBuilder.AppendLine("[ArticleDescription] [nvarchar](150) NOT NULL,");
				stringBuilder.AppendLine("[QuantityValue] [int] NOT NULL,");
				stringBuilder.AppendLine("[QuantityUnitKey] [nvarchar](10) NOT NULL,");
				stringBuilder.AppendLine("[IsCarDump] [bit] NOT NULL,");
				stringBuilder.AppendLine("[IsSample] [bit] NOT NULL,");
				stringBuilder.AppendLine("CONSTRAINT [PK_OrderItem] PRIMARY KEY CLUSTERED");
				stringBuilder.AppendLine("(");
				stringBuilder.AppendLine("[OrderItemId] ASC");
				stringBuilder.AppendLine(")WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]");
				stringBuilder.AppendLine(") ON [PRIMARY]");

				Database.ExecuteNonQuery(stringBuilder.ToString());
			}
		}
		public override void Down()
		{

		}
	}
}
