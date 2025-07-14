namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20211123094600)]
	public class AddVisitStatusLookupTable : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[LU].[VisitStatus]"))
			{
				Database.ExecuteNonQuery(@"
				CREATE TABLE [LU].[VisitStatus](
				[VisitStatusId] [int] IDENTITY(1,1) NOT NULL,
				[Name] [nvarchar](50) NOT NULL,
				[Language] [nvarchar](2) NOT NULL,
				[Value] [nvarchar](20) NOT NULL,
				[SettableStatuses] [nvarchar](500) NULL,
				[Favorite] [bit] NOT NULL,
				[SortOrder] [int] NOT NULL,
				[CreateDate] [datetime] NOT NULL,
				[ModifyDate] [datetime] NOT NULL,
				[CreateUser] [nvarchar](256) NOT NULL,
				[ModifyUser] [nvarchar](256) NOT NULL,
				[IsActive] [bit] NOT NULL

				PRIMARY KEY CLUSTERED 
				(
					[VisitStatusId] ASC
				)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 80) ON [PRIMARY]
				) ON [PRIMARY]
					ALTER TABLE [LU].[VisitStatus] ADD  CONSTRAINT [DF__VisitStatus__Favor]  DEFAULT ((0)) FOR [Favorite]
					ALTER TABLE [LU].[VisitStatus] ADD  CONSTRAINT [DF__VisitStatus__Sort]  DEFAULT ((0)) FOR [SortOrder]
					ALTER TABLE [LU].[VisitStatus] ADD  CONSTRAINT [DF_LUVisitStatus_CreateDate]  DEFAULT (getutcdate()) FOR [CreateDate]
					ALTER TABLE [LU].[VisitStatus] ADD  CONSTRAINT [DF_LUVisitStatus_ModifyDate]  DEFAULT (getutcdate()) FOR [ModifyDate]
					ALTER TABLE [LU].[VisitStatus] ADD  CONSTRAINT [DF_LUVisitStatus_IsActive]  DEFAULT ((1)) FOR [IsActive]
			");
			}
		}
	}
}
