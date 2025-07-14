namespace Crm.Order.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120101010000)]
	public class CreateCrmOrder : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[Order]"))
			{

				var stringBuilder = new StringBuilder();

				stringBuilder.AppendLine("CREATE TABLE [CRM].[Order] (");
				stringBuilder.AppendLine("[OrderId] [int] IDENTITY(1,1) NOT NULL,");
				stringBuilder.AppendLine("[BusinessPartnerContactKey] [int] NOT NULL,");
				stringBuilder.AppendLine("[BusinessPartnerName] [nvarchar](120) NOT NULL,");
				stringBuilder.AppendLine("[BusinessPartnerAddressKey] [int] NOT NULL,");
				stringBuilder.AppendLine("[BusinessPartnerStreet] [nvarchar](120) NOT NULL,");
				stringBuilder.AppendLine("[BusinessPartnerZipCode] [nvarchar](20) NOT NULL,");
				stringBuilder.AppendLine("[BusinessPartnerCity] [nvarchar](120) NOT NULL,");
				stringBuilder.AppendLine("[DeliveryAddressKey] [int] NOT NULL,");
				stringBuilder.AppendLine("[DeliveryAddressName] [nvarchar](120) NOT NULL,");
				stringBuilder.AppendLine("[DeliveryAddressStreet] [nvarchar](120) NOT NULL,");
				stringBuilder.AppendLine("[DeliveryAddressZipCode] [nvarchar](20) NOT NULL,");
				stringBuilder.AppendLine("[DeliveryAddressCity] [nvarchar](120) NOT NULL,");
				stringBuilder.AppendLine("[BillAddressKey] [int] NOT NULL,");
				stringBuilder.AppendLine("[BillAddressName] [nvarchar](120) NOT NULL,");
				stringBuilder.AppendLine("[BillAddressStreet] [nvarchar](120) NOT NULL,");
				stringBuilder.AppendLine("[BillAddressZipCode] [nvarchar](20) NOT NULL,");
				stringBuilder.AppendLine("[BillAddressCity] [nvarchar](120) NOT NULL,");
				stringBuilder.AppendLine("[OrderDate] [date] NOT NULL,");
				stringBuilder.AppendLine("[DeliveryDate] [date] NULL,");
				stringBuilder.AppendLine("[Status] [int] NOT NULL,");
				stringBuilder.AppendLine("[ResponsibleUser] [nvarchar](256) NOT NULL,");
				stringBuilder.AppendLine("[CreateDate] [datetime] NOT NULL,");
				stringBuilder.AppendLine("[CreateUser] [nvarchar](256) NOT NULL,");
				stringBuilder.AppendLine("[ModifyDate] [datetime] NOT NULL,");
				stringBuilder.AppendLine("[ModifyUser] [nvarchar](256) NOT NULL,");
				stringBuilder.AppendLine("CONSTRAINT [PK_Order] PRIMARY KEY CLUSTERED");
				stringBuilder.AppendLine("(");
				stringBuilder.AppendLine("[OrderId] ASC");
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
