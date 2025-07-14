namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170329090400)]
	public class AddLookupTableVisitAim : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
				CREATE TABLE [LU].[VisitAim](
					[VisitAimId] [int] IDENTITY(1,1) NOT NULL,
					[Name] [nvarchar](50) NOT NULL,
					[Language] [nvarchar](2) NOT NULL,
					[Value] [nvarchar](20) NOT NULL,
					[Favorite] [bit] NOT NULL,
					[SortOrder] [int] NOT NULL,
					[Color] [nvarchar](20) NOT NULL,
					[TenantKey] [int] NULL,
					[CreateDate] [datetime] NOT NULL,
					[ModifyDate] [datetime] NOT NULL,
					[CreateUser] [nvarchar](256) NOT NULL,
					[ModifyUser] [nvarchar](256) NOT NULL,
					[IsActive] [bit] NOT NULL,
					[LegacyId] [nvarchar](50) NULL,
					[LegacyVersion] [bigint] NULL,
				 CONSTRAINT [PK_VisitAim] PRIMARY KEY CLUSTERED 
				(
					[VisitAimId] ASC
				)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
				) ON [PRIMARY]

				ALTER TABLE [LU].[VisitAim] ADD  CONSTRAINT [DF_VisitAim_Language]  DEFAULT ('en') FOR [Language]
				ALTER TABLE [LU].[VisitAim] ADD  CONSTRAINT [DF_VisitAim_Value]  DEFAULT ((0)) FOR [Value]
				ALTER TABLE [LU].[VisitAim] ADD  CONSTRAINT [DF_VisitAim_Favorite]  DEFAULT ((0)) FOR [Favorite]
				ALTER TABLE [LU].[VisitAim] ADD  CONSTRAINT [DF_VisitAim_SortOrder]  DEFAULT ((0)) FOR [SortOrder]
				ALTER TABLE [LU].[VisitAim] ADD  CONSTRAINT [DF_VisitAim_Color]  DEFAULT ('#9E9E9E') FOR [Color]
				ALTER TABLE [LU].[VisitAim] ADD  CONSTRAINT [DF_VisitAim_CreateDate]  DEFAULT (GETUTCDATE()) FOR [CreateDate]
				ALTER TABLE [LU].[VisitAim] ADD  CONSTRAINT [DF_VisitAim_ModifyDate]  DEFAULT (GETUTCDATE()) FOR [ModifyDate]
				ALTER TABLE [LU].[VisitAim] ADD  CONSTRAINT [DF_VisitAim_CreateUser]  DEFAULT ('Setup') FOR [CreateUser]
				ALTER TABLE [LU].[VisitAim] ADD  CONSTRAINT [DF_VisitAim_ModifyUser]  DEFAULT ('Setup') FOR [ModifyUser]
				ALTER TABLE [LU].[VisitAim] ADD  CONSTRAINT [DF_VisitAim_IsActive]  DEFAULT ((1)) FOR [IsActive]
			");
		}
	}
}