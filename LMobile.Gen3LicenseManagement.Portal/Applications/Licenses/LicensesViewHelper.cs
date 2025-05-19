using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;
using LMobile.MiniForms;
using LMobile.MiniForms.Classic;
using System.Drawing;
using LMobile.Gen3LicenseManagement.Portal.Applications.QuestionDialog;
using System.Linq;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Licenses {
	public static class LicensesViewHelper {
		internal static ColumnsLayout AddProjectEditArea(this Layout layout, BindingSource<LicensesApplication> application, BindingSource<ProjectModuleProperty> moduleProperties, bool readOnly) {
			if (readOnly) {
				layout.AddToggleButton().SetStyle(ClassicStyleSheet.SectionHeader).SetCaption(Resources.Project())
					.BindChecked(application, app => app.CurrentProjectShown, true, (app, value) => app.CurrentProjectShown = value);
			}

			var editor = layout.AddLinesLayout()
						.SetStyle(ClassicStyleSheet.W100
							+ ClassicStyleSheet.SectionBody
							+ new Style() { HorizontalSpacing = new Length(5, In.Points) });

			var editorColumns = editor
			  .AddColumnsLayout()
			  .BindDisplayed(application, app => app.CurrentProjectShown || !readOnly);
			Style styleLabel = ClassicStyleSheet.W2in9;
			Style styleDate = new Style() { Width = new Length(5, LengthUnit.Characters) };
			Style styleDateLabel = new Style() { Width = new Length(1.5, LengthUnit.Characters) };

			var editorFields = editorColumns.AddTableLayout()
							  .SetStyle(ClassicStyleSheet.WRemainder);

			#region edit project fields
			editorFields.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
					  .SetStyle(styleLabel)
					  .SetCaption(Resources.ContractNo());
					collay.AddTextBox()
			  .SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in9)
			  .BindReadOnly(application, app => !app.CanUserEditProject || readOnly)
			  .BindText(application, app => app.CurrentProject.ContractNo, false,
						 (app, value) => app.CurrentProject.ContractNo = value);
				});
			});
			editorFields.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
					  .SetStyle(styleLabel)
					  .SetCaption(Resources.Guid());
					collay.AddLabel()
			  .SetStyle(ClassicStyleSheet.WRemainder)
			  .BindCaption(application, app => app.CurrentProject.ProjectGuid.ToString());
				});
			});
			editorFields.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
					  .SetStyle(styleLabel)
					  .SetCaption(Resources.ProjectType());
					collay.AddDropDownBox<StoredProjectType>(pt => pt.ProjectType)
			  .SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in7)
			  .BindEnabled(application, app => app.CanUserEditProject && !readOnly)
			  .BindItems(application, app => app.ProjectTypes)
			  .BindSelectedItem(application, app => app.ProjectTypes.FirstOrDefault(pt => pt.ProjectType == app.CurrentProject.ProjectType), true,
						 (app, value) => app.SetProjectType(value));
				});
			});
			editorFields.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
					.SetStyle(styleLabel)
					.SetCaption(Resources.Description());
					collay.AddTextBox()
			  .SetStyle(ClassicStyleSheet.WRemainder)
			  .BindReadOnly(application, app => !app.CanUserEditProject || readOnly)
			  .BindText(application, app => app.CurrentProject.Description, false,
						 (app, value) => app.CurrentProject.Description = value);
				});
			});
			editorFields.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
					 .SetStyle(styleLabel)
					 .SetCaption(Resources.CustomerEMail());
					collay.AddTextBox()
			  .SetStyle(ClassicStyleSheet.WRemainder)
			  .BindReadOnly(application, app => !app.CanUserEditProject || readOnly)
			  .BindText(application, app => app.CurrentProject.EMail, false,
						 (app, value) => app.CurrentProject.EMail = value);
				});
			});
			editorFields.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
				   .SetStyle(styleLabel)
				   .SetCaption(Resources.NotifyEMail());
					collay.AddTextBox()
			  .SetStyle(ClassicStyleSheet.WRemainder)
			  .BindReadOnly(application, app => !app.CanUserEditProject || readOnly)
			  .BindText(application, app => app.CurrentProject.NotifyEMail, false,
						 (app, value) => app.CurrentProject.NotifyEMail = "support@l-mobile.com; " + value);
				});
			});
			editorFields.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
					 .SetStyle(styleLabel)
					 .SetCaption(Resources.ExpirationDate());
					collay.AddTextBox()
			  .BindStyle(application, app => ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in9 + app.GetColorByDate())
			  .BindReadOnly(application, app => !app.CanUserEditProject || readOnly)
			  .BindText(application, app => app.CurrentProject.ExpiryDate.ToShortDateString(), false,
						 (app, value) => app.CurrentProject.ExpiryDate = DateTimeParser.Parse(value));
				});
			});
			editorFields.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
				   .SetStyle(styleLabel)
				   .SetCaption(Resources.ExpirationInMonth());
					collay.AddTextBox()
			  .SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.Right + ClassicStyleSheet.W1in9)
			  .BindReadOnly(application, app => !app.CanUserEditProject || readOnly)
			  .BindText(application, app => !app.CurrentProject.ExpiryInMonths.HasValue ? null : app.CurrentProject.ExpiryInMonths.Value.ToString(), false,
						 (app, value) => app.CurrentProject.ExpiryInMonths = IntParser.ParseNullable(value));
				});
			});
			editorFields.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
						.SetStyle(styleLabel)
						.SetCaption(Resources.LicenseCount());
					collay.AddTextBox()
			  .SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.Right + ClassicStyleSheet.W1in9)
			  .BindReadOnly(application, app => !app.CanUserEditProject || readOnly)
			  .BindText(application, app => app.CurrentProject.ProductiveLicenseCount.ToString("N0"), false,
					   (app, value) => app.CurrentProject.ProductiveLicenseCount = IntParser.Parse(value));
				});
			});
			editorFields.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
				.SetStyle(styleLabel)
				.SetCaption(Resources.TestLicenseCount());
					collay.AddTextBox()
				   .SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.Right + ClassicStyleSheet.W1in9)
				   .BindReadOnly(application, app => !app.CanUserEditProject || readOnly)
				   .BindText(application, app => app.CurrentProject.TestLicenseCount.ToString("N0"), false,
							  (app, value) => app.CurrentProject.TestLicenseCount = IntParser.Parse(value));
				});
			});
			editorFields.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
						  .SetStyle(styleLabel)
						  .SetCaption(Resources.L_lblAddTempLicenses());
					collay.AddTextBox()
			  .SetStyle(ClassicStyleSheet.Right + ClassicStyleSheet.W1in9)
			  .BindReadOnly(application, app => !app.CanUserEditProject || readOnly)
			  .BindText(application, app => app.GetAddTempLicenseCount(), true, (app, value) => app.SetAddTempLicenseCount(value));

					collay.AddLabel()
						.SetCaption(Resources.L_lblTempLicensesStartDate())
						.BindDisplayed(application, app => app.OnDisplayed_TempLicensesDates());
					collay.AddTextBox()
			  .BindStyle(application, app => styleDate + app.GetColorByDate(app.CurrentProject.XtendedStartDate))
			  .BindReadOnly(application, app => !app.CanUserEditProject || readOnly)
			  .BindDisplayed(application, app => app.OnDisplayed_TempLicensesDates())
			  .BindText(application, app => app.GetAddTempLicenseStartDate(), true, (app, value) => app.OnChange_tempStartDate(value));

					collay.AddLabel()
						.SetCaption(Resources.L_lblTempLicensesExpirationDate())
					 .BindDisplayed(application, app => app.OnDisplayed_TempLicensesDates());
					collay.AddTextBox()
			  .BindStyle(application, app => styleDate + app.GetColorByDate(app.CurrentProject.XtendedFinishDate))
			  .BindReadOnly(application, app => !app.CanUserEditProject || readOnly)
			  .BindDisplayed(application, app => app.OnDisplayed_TempLicensesDates())
			  .BindText(application, app => app.GetAddTempLicenseExpirationDate(), true, (app, value) => app.OnChange_tempExpirationDate(value));
				}).BindDisplayed(application, app => true);
			});

			var editorButtons = editorColumns.AddLinesLayout();
			editorButtons.AddActionButton()
				.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.Disk))
				.BindDisplayed(application, app => app.CanUserEditProject && !readOnly)
				.BindAction(application, app => app.SaveCurrentProject());
			editorButtons.AddActionButton()
				.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.ArrowLeft))
				.BindDisplayed(application, app => app.CanUserEditProject && !readOnly)
				.BindAction(application, app => app.ResetCurrentProject());
			editorColumns.AddLabel().SetStyle(new Style { Width = new Length(1, In.Characters) });
			#endregion edit project fields

			#region modules 
			var modules = editor
			  .AddTableLayout()
			  .SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.Panel);

			Style stlModuleID = new Style() { Width = new Length(5, LengthUnit.Characters) };
			Style stlModuleName = new Style() { Width = new Length(23, LengthUnit.Characters) };
			Style stlFill = new Style() { Width = new Length(3, LengthUnit.Characters), };
			Style stlCountProd = new Style() { Width = new Length(4, LengthUnit.Characters), };
			Style stlCountTest = new Style() { Width = new Length(4, LengthUnit.Characters), };
			Style stlDate = new Style() { Width = new Length(5, LengthUnit.Characters), };
			Style stlSave = new Style() { Width = new Length(1.3, LengthUnit.Characters), };
			Style stlDelete = new Style() { Width = new Length(1.3, LengthUnit.Characters), };

			#region modules search
			modules.AddRow(row => {
				LinesLayout line = row.AddLinesLayout();
				ColumnsLayout col = line.AddColumnsLayout();
				row.Span(10, 1);
				col.AddLabel()
					.SetStyle(ClassicStyleSheet.Bold + stlModuleID)
					.SetCaption(Resources.L_lblSerachModuleByName());
				col.AddTextBox()
			.BindText(application, app1 => app1.SearchModuleName
						, true
						, (app1, value) => app1.OnChange_SearchModuleName(value))
						.BindGrabFocus(application, app => true)
						.SetKeepSelectionWhenFocusStays(false);
				col.AddLabel()
				.SetStyle(ClassicStyleSheet.W6in9)
				.SetCaption(Resources.L_lblSerachModuleByNameDescription());


			}).BindDisplayed(application, app => app.CanUserEditProject && !readOnly);
			#endregion modules search

			#region modules header
			modules.AddRow(row => {
				LinesLayout line = row.AddLinesLayout();
				ColumnsLayout col = line.AddColumnsLayout();
				row.Span(10, 1);

				col.AddLabel().BindStyle(application, app1 => ClassicStyleSheet.Bold + stlModuleID).SetCaption(Resources.ModulesMenu());
				col.AddLabel().BindStyle(application, app1 => ClassicStyleSheet.Bold + stlModuleName).SetCaption(Resources.Name());
				col.AddLabel().BindStyle(application, app1 => ClassicStyleSheet.Bold + stlFill).SetCaption(Resources.L_lblFill()).BindDisplayed(application, app => app.CanUserEditProject && !readOnly);
				col.AddLabel().BindStyle(application, app1 => ClassicStyleSheet.Bold + ClassicStyleSheet.Right + stlCountProd).SetCaption(Resources.L_lblLicenseCountProd()).BindDisplayed(application, app => app.CanUserEditProject && !readOnly);
				col.AddLabel().BindStyle(application, app1 => ClassicStyleSheet.Bold + ClassicStyleSheet.Right + stlCountTest).SetCaption(Resources.L_lblLicenseCountTest()).BindDisplayed(application, app => app.CanUserEditProject && !readOnly);
				col.AddLabel().BindStyle(application, app1 => ClassicStyleSheet.Bold + stlDate).SetCaption(Resources.ExpirationDate()).BindDisplayed(application, app => app.CanUserEditProject && !readOnly);
				col.AddLabel().BindStyle(application, app1 => ClassicStyleSheet.Bold + stlSave).BindDisplayed(application, app => app.CanUserEditProject && !readOnly);
				col.AddLabel().BindStyle(application, app1 => ClassicStyleSheet.Bold + stlDelete).BindDisplayed(application, app => app.CanUserEditProject && !readOnly);
				col.AddLabel().BindStyle(application, app1 => new Style { Width = new Length(1, In.Characters) }).BindDisplayed(application, app => app.CanUserEditProject && !readOnly);
			});
			#endregion modules header

			#region modules select
			modules.AddRow(row => {
				LinesLayout line = row.AddLinesLayout();
				ColumnsLayout col = line.AddColumnsLayout();
				row.Span(10, 1);

				col.AddDropDownBox<Module>(m => m.Description)
				  .BindStyle(application, app1 => stlModuleID)
				  .BindVisible(application, app1 => app1.CanUserEditProject && !readOnly)
				  .BindItems(application, app1 => app1.Modules)
				  .BindSelectedItem(application, app1 => app1.SelectedNewModule, true,
							 (app1, value) => app1.SelectedNewModule = value);
				col.AddDropDownBox<ModuleProperty>(m => m.PropertyName + " - " + m.Description)
			.BindStyle(application, app1 => stlModuleName)
			.BindVisible(application, app1 => app1.OnDisplayed_EditFields(readOnly))
			.BindItems(application, app1 => app1.ModuleProperties)
			.BindSelectedItem(application, app1 => app1.SelectedNewModuleProperty, true,
					   (app1, value) => app1.OnChange_Property(value));
				col.AddColumnsLayout(lyt => {
					lyt.AddCheckBox()
		  .BindStyle(application, app1 => ClassicStyleSheet.Center + new Style { Width = new Length(1, In.Characters) })
		  .BindDisplayed(application, app1 => app1.OnDisplayed_EditFields(readOnly))
		  .BindChecked(application, app => app.CanFill, true, (app, value) => app.OnChecked_CanFill(value));
				}).BindStyle(application, app1 => ClassicStyleSheet.Center + stlFill);

				col.AddTextBox()
			.BindStyle(application, app1 => ClassicStyleSheet.Right + stlCountProd)
			.BindDisplayed(application, app1 => app1.OnDisplayed_EditFields(readOnly))
			.BindText(application, app1 => app1.NewModulePropertyLicenceCount.ToString("N0"), true,
					   (app1, value) => app1.NewModulePropertyLicenceCount = IntParser.Parse(value));
				col.AddTextBox()
			.BindStyle(application, app1 => ClassicStyleSheet.Right + stlCountTest)
			.BindDisplayed(application, app1 => app1.OnDisplayed_EditFields(readOnly))
			.BindText(application, app1 => app1.NewModulePropertyTestLicenceCount.ToString("N0"), true,
					   (app1, value) => app1.NewModulePropertyTestLicenceCount = IntParser.Parse(value));
				col.AddTextBox()
			.BindStyle(application, app1 => stlDate)
			.BindDisplayed(application, app1 => app1.OnDisplayed_EditFields(readOnly))
			.BindText(application, app1 => app1.NewModulePropertyExpiryDate.ToShortDateString(), true,
					   (app1, value) => app1.NewModulePropertyExpiryDate = DateTimeParser.Parse(value));
				col.AddActionButton()
				.BindStyle(application, (app) => ClassicStyleSheet.ContentIconButton(MonoIcon.Disk) +
					new Style { Height = new Length(1.3, In.Characters), Width = new Length(1.3, In.Characters), IconSize = new Length(0.5, In.Auto) })
			.BindDisplayed(application, app => app.OnDisplayed_EditFields(readOnly))
				.BindAction(application, (app) => app.SaveProjectModuleProperty(null));
				col.AddLabel()
		  .BindDisplayed(application, app => app.OnDisplayed_EditFields(readOnly));
			});
			#endregion modules select

			#region modules edit all
			modules.AddRow(row => {
				LinesLayout line = row.AddLinesLayout();
				ColumnsLayout col = line.AddColumnsLayout();
				row.Span(10, 1);
				line.BindStyle(application, app1 => new Style() { BottomBorder = new Length(0.5, LengthUnit.Points), BorderColor = Color.Gray, BottomPadding = new Length(1, LengthUnit.Points) });
				col.AddLabel()
						  .BindStyle(application, app1 => stlModuleID)
						  .BindDisplayed(application, app1 => app1.CanUserEditProject && !readOnly);
				col.AddLabel()
					.BindStyle(application, app1 => stlModuleName)
					.BindDisplayed(application, app1 => app1.CanUserEditProject && !readOnly);
				col.AddLabel()
					  .BindStyle(application, app1 => stlFill)
					  .BindDisplayed(application, app1 => app1.CanUserEditProject && !readOnly);
				col.AddTextBox()
			.BindStyle(application, app1 => ClassicStyleSheet.Right + stlCountProd)
			.BindDisplayed(application, app1 => app1.CanUserEditProject && !readOnly)
			.BindText(application, app1 => app1.GetNumberStringFormat(app1.AllModulesPropertyLicenceCount), true,
					   (app1, value) => app1.AllModulesPropertyLicenceCount = IntParser.Parse(value));
				col.AddTextBox()
			.BindStyle(application, app1 => ClassicStyleSheet.Right + stlCountTest)
			.BindDisplayed(application, app1 => app1.CanUserEditProject && !readOnly)
			.BindText(application, app1 => app1.GetNumberStringFormat(app1.AllModulesPropertyTestLicenceCount), true,
					   (app1, value) => app1.AllModulesPropertyTestLicenceCount = IntParser.Parse(value));
				col.AddTextBox()
			.BindStyle(application, app1 => stlDate)
			.BindDisplayed(application, app1 => app1.CanUserEditProject && !readOnly)
			.BindText(application, app1 => app1.AllModulesPropertyExpiryDate.ToShortDateString(), true,
					   (app1, value) => app1.AllModulesPropertyExpiryDate = DateTimeParser.Parse(value));
				col.AddActionButton()
			.BindStyle(application, (app) => ClassicStyleSheet.ContentIconButton(MonoIcon.Disk) +
				new Style {
					Height = new Length(1.3, In.Characters),
					Width = new Length(1.3, In.Characters),
					IconSize = new Length(0.5, In.Auto),
				}
				+ app.GetColorByChanges()
					   )
			.BindDisplayed(application, app =>
			  app.CanUserEditProject
			  && !readOnly
			  )
				.BindAction(application, (app) => app.SaveAllProjectModuleProperties());
				col.AddLabel()
					.BindDisplayed(application, app1 => app1.CanUserEditProject && !readOnly);
			});
			#endregion modules edit all

			#region modules edit 
			modules.AddIteration(moduleProperties, (app) => {
				modules.AddRow(row => {
					LinesLayout line = row.AddLinesLayout();
					ColumnsLayout col = line.AddColumnsLayout();
					row.Span(10, 1);

					line.BindStyle(application, app1 => new Style {
						BottomBorder = new Length(0.5, LengthUnit.Points),
						BorderColor = Color.Gray,
						BottomPadding = new Length(1, LengthUnit.Points),
						TopPadding = new Length(1, LengthUnit.Points)
					});

					col.AddLabel()
						.BindStyle(application, moduleProperties, (app1, prop) => stlModuleID + app1.GetColorByModuleSearch(prop))
						.BindCaption(moduleProperties, prop => prop.ModuleProperty.PropertyName);

					col.AddLabel()
						.BindStyle(application, moduleProperties, (app1, prop) => stlModuleName + app1.GetColorByModuleSearch(prop))
						.BindCaption(moduleProperties, prop => prop.ModuleProperty.Description);

					col.AddLabel()
						.BindStyle(application, app1 => stlFill);

					col.AddTextBox()
						.BindStyle(application, moduleProperties, (app1, prop) =>
							ClassicStyleSheet.Right + stlCountProd + app1.GetColorByLiveCount(prop))
						.BindEnabled(application, moduleProperties, (app1, prop) => app1.CanUserEditProject && !readOnly)
						.BindText(application, moduleProperties, (app1, prop) => prop.ProductiveLicenseCount.ToString("N0"), true,
							(app1, prop, value) => prop.ProductiveLicenseCount = IntParser.Parse(value));

					col.AddTextBox()
						.BindStyle(application, moduleProperties, (app1, prop) =>
							ClassicStyleSheet.Right + stlCountTest + app1.GetColorByTestCount(prop))
						.BindEnabled(application, moduleProperties, (app1, prop) => app1.CanUserEditProject && !readOnly)
						.BindText(application, moduleProperties, (app1, prop) => prop.TestLicenseCount.ToString("N0"), true,
							(app1, prop, value) => prop.TestLicenseCount = IntParser.Parse(value));

					col.AddTextBox()
						.BindStyle(application, moduleProperties, (app1, prop) =>
							stlDate + app1.GetColorByDate(prop.ExpiryDate))
						.BindEnabled(application, moduleProperties, (app1, prop) => app1.CanUserEditProject && !readOnly)
						.BindText(application, moduleProperties, (app1, prop) => prop.ExpiryDate.ToShortDateString(), true,
							(app1, prop, value) => prop.ExpiryDate = DateTimeParser.Parse(value));

					col.AddActionButton()
						.BindStyle(application, (app1) => ClassicStyleSheet.ContentIconButton(MonoIcon.Disk) +
							new Style { Height = new Length(1.3, In.Characters), Width = new Length(1.3, In.Characters), IconSize = new Length(0.5, In.Auto) })
						.BindDisplayed(application, moduleProperties, (app1, prop) => app1.OnDisplayed_Save(prop, readOnly))
						.BindAction(application, moduleProperties, (app1, prop) => app1.SaveProjectModuleProperty(prop));

					col.AddActionButton()
						.BindStyle(application, (app1) => ClassicStyleSheet.ContentIconButton(MonoIcon.X) +
							new Style { Height = new Length(1.3, In.Characters), Width = new Length(1.3, In.Characters), IconSize = new Length(0.5, In.Auto) })
						.BindDisplayed(application, moduleProperties, (app1, prop) => app1.CanUserEditProject && !readOnly)
						  .BindAction(application, moduleProperties, (app1, prop) => {
							  Responses resp = ShowQuestionNotification(app1, "wirklich löschen?");
							  switch (resp) {
								  case Responses.NO:
									  return;
								  case Responses.YES:
									  app1.DeleteProjectModuleProperty(prop);
									  break;
								  default:
									  return;
							  }
						  });
				});
			});
			#endregion modules edit 

			#endregion modules

			return editorColumns;
		}

		internal static TableLayout AddInstallationTable(this Layout layout, BindingSource<LicensesApplication> application, BindingSource<Installation> installations) {
			var installationTable = layout.AddTableLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.Panel);
			installationTable.AddRow(row => {
				row.SetChildStyle(ClassicStyleSheet.Bold + new Style {
					BottomMargin = new Length(2, In.Pixels),
					BottomPadding = new Length(2, In.Pixels),
				});
				row.AddLabel().SetCaption(Resources.L_lblCountModule());
				row.BindDisplayed(application, app => app.CurrentProjectModulcounter > 0);
				row.AddLabel().BindCaption(application, app => app.CurrentProject == null ? null : app.CurrentProject.ModuleProperties.Count.ToString());
			});
			installationTable.AddRow(row => {
				row.SetChildStyle(ClassicStyleSheet.Bold);
				row.AddLabel().SetCaption(Resources.InstallationType()).SetStyle(new Style { ContentAlignment = Alignment.MiddleLeft });
				row.AddLabel().SetCaption(Resources.Version()).SetStyle(new Style { ContentAlignment = Alignment.MiddleLeft });
				row.AddLabel().SetCaption(Resources.InstallationInformationTitle()).SetStyle(ClassicStyleSheet.WRemainder).Span(3, 1);
			});
			installationTable.AddIteration(installations, i => {
				installationTable.AddRow(row => {
					row.AddLabel()
				.SetStyle(ClassicStyleSheet.Bold)
				 .BindCaption(installations, installation => installation.InstallationType);
					row.AddLabel()
			  .SetStyle(ClassicStyleSheet.Bold)
		.BindCaption(installations, installation => {
			return installation.Version.ToString();
		});
					row.AddLabel()
			   .BindCaption(installations, installation => installation.LicensedRequestData == null ? null : installation.LicensedRequestData.InstallationLocation)
			   .SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.Positive);
					row.AddActionButton().Span(1, 2)
				  .SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.Copy))
					.BindEnabled(application, installations, (app, installation) => app.Client.CurrentPrincipal.IsInRole("Gen3ExportLicense"))
				  .BindDisplayed(application, installations, (app, installation) => app.IsLicensedInstallation(installation) || app.IsPortableInstallation(installation))
				   .BindAction(application, installations, (app, installation) => app.CopyLicensedRequestToClipboard(installation.ID));


					row.AddActionButton()
				.Span(1, 2)
				.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.Mail))
				.BindEnabled(application, installations, (app, installation) => app.Client.CurrentPrincipal.IsInRole("Gen3ExportMail"))
				.BindDisplayed(application, installations, (app, installation) => app.IsLicensedInstallation(installation) || app.IsPortableInstallation(installation))
				.BindAction(application, installations, (app, installation) => app.ShowEmailView(installation.ID, installation.InstallationType));
				});

				installationTable.AddRow(row => {
					row.AddLabel();
					row.AddLabel();
					row.AddLabel()
				 .BindCaption(installations, installation => installation.LicensedRequestData == null ? null : installation.LicensedRequestData.HardwareKey)
				 .SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.Positive);
					row.AddLabel();
					row.AddLabel();
				});
				installationTable.AddRow(row => {
					row.AddLabel();
					row.AddLabel();
					row.AddLabel()
				 .BindCaption(installations, installation => installation.PendingRequestData == null ? null : installation.PendingRequestData.InstallationLocation)
				 .SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.Info);
					row.AddActionButton().Span(1, 2)
					.BindStyle(application, installations, (app, installation) =>
					  !app.IsPendingInstallation(installation) ?
					  ClassicStyleSheet.ContentIconButton(MonoIcon.X) :
					  ClassicStyleSheet.ContentIconButton(MonoIcon.Check))
					.BindEnabled(application, installations, (app, installation) => app.Client.CurrentPrincipal.IsInRole("Gen3ActivateLicense"))
					.BindVisible(application, installations, (app, installation) => app.IsPendingInstallation(installation) || app.IsLicensedInstallation(installation) || app.IsPortableInstallation(installation))
					.BindAction(application, installations, (app, installation) => {
						if (app.IsLicensedInstallation(installation)) {
							app.DeActivateLicensedRequest(installation.ID);
						} else if (app.IsPendingInstallation(installation)) {
							app.ActivatePendingRequest(installation.ID);
						} else if (app.IsPortableInstallation(installation)) {
							app.DeletePortableInstallation(installation.ID);
						}
					});
					row.AddToggleButton().Span(1, 2)
					.SetStyle(ClassicStyleSheet.CheckToggler + new Style { ContentAlignment = Alignment.MiddleLeft })
					.SetCaption("ADLD")
					.BindEnabled(application, installations, (app, installation) => app.Client.CurrentPrincipal.IsInRole("Gen3ActivateAutoDownload"))
					.BindVisible(application, installations, (app, installation) => !app.IsPortableInstallation(installation))
					.BindChecked(application, installations, (app, installation) => installation.AutoAcceptRequests, true, (app, installation, value) => app.SetAutoAcceptRequests(installation));
				});
				installationTable.AddRow(row => {
					row.AddLabel();
					row.AddLabel();
					row.AddLabel()
				.BindCaption(installations, installation => installation.PendingRequestData == null ? null : installation.PendingRequestData.HardwareKey)
				.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.Info);
					row.AddLabel();
					row.AddLabel();
				});
				installationTable.AddRow(row => {
					row.AddLabel();
					row.AddLabel();
					row.AddLabel()
				 .BindCaption(installations, installation => installation.PendingRequestData == null ? null : installation.PendingRequestData.HardwareKey)
				 .SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.Info);
					row.AddLabel();
					row.AddLabel();
				});
				installationTable.AddRow(row => {
					row.AddLabel()
				.Span(5, 1)
				.SetStyle(ClassicStyleSheet.WRemainder +
				new Style {
					BorderColor = Color.Gray,
					BottomBorder = new Length(1, In.Pixels),
					Height = new Length(5, In.Pixels),
					BottomMargin = new Length(2, In.Pixels),
					BottomPadding = new Length(2, In.Pixels)
				});
				});
			});
			return installationTable;
		}

		internal static TableLayout AddLogEntryTable(this Layout layout, BindingSource<LicensesApplication> application, BindingSource<ProjectLog> LogEntries) {
			var LogEntryTable = layout.AddTableLayout();
			LogEntryTable.AddRow(row => {
				row.SetChildStyle(ClassicStyleSheet.Bold);
				row.AddLabel().SetCaption(Resources.LogEntryMessageType()).SetStyle(new Style { ContentAlignment = Alignment.MiddleLeft });
				row.AddLabel().SetCaption(Resources.LogEntryInformation()).SetStyle(ClassicStyleSheet.WRemainder);
			});
			LogEntryTable.AddIteration(LogEntries, i => {
				LogEntryTable.AddRow(row => {
					row.AddLabel()
				 .BindCaption(LogEntries, logEntry => logEntry.MessageType);
					row.AddLabel()
				.SetStyle(ClassicStyleSheet.WordWrap)
				 .BindCaption(LogEntries, logEntry => logEntry.Message + " at " + logEntry.CreateDate.ToShortDateString() + " " + logEntry.CreateDate.ToShortTimeString());
				});
				LogEntryTable.AddRow(row => {
					row.AddLabel();
					row.AddLabel()
				.SetStyle(ClassicStyleSheet.WordWrap)
				 .BindCaption(LogEntries, logEntry => string.IsNullOrEmpty(logEntry.MessageLong) ? null : logEntry.MessageLong);
				}).BindDisplayed(LogEntries, entry => !string.IsNullOrEmpty(entry.MessageLong));
				LogEntryTable.AddRow(row => {
					row.AddLabel();
					row.AddLabel()
				.SetStyle(ClassicStyleSheet.WordWrap)
				 .BindCaption(LogEntries, logEntry => string.IsNullOrEmpty(logEntry.Stacktrace) ? null : logEntry.Stacktrace);
				}).BindDisplayed(LogEntries, entry => !string.IsNullOrEmpty(entry.Stacktrace));
				LogEntryTable.AddRow(row => {
					row.AddLabel();
					row.AddLabel()
				 .BindCaption(LogEntries, logEntry => Resources.InstallationTypeIs(logEntry.Installation.InstallationType));
				}).BindDisplayed(LogEntries, entry => entry.Installation != null);
				LogEntryTable.AddRow(row => {
					row.AddLabel();
					row.AddLabel()
				 .BindCaption(LogEntries, logEntry => Resources.UserIs(logEntry.UserName));
				}).BindDisplayed(LogEntries, entry => !string.IsNullOrEmpty(entry.UserName));
				LogEntryTable.AddRow(row => {
					row.AddLabel();
					row.AddLabel()
				.Span(2, 1)
				.SetStyle(ClassicStyleSheet.WRemainder +
				new Style {
					BorderColor = Color.Gray,
					BottomBorder = new Length(1, In.Pixels),
					Height = new Length(5, In.Pixels),
					BottomMargin = new Length(2, In.Pixels),
					BottomPadding = new Length(2, In.Pixels)
				});
				});
			});
			return LogEntryTable;
		}

		public static Responses ShowQuestionNotification(MiniFormsApplication p_App
			, string p_Question
			, QButtons p_Button = QButtons.YES_NO
			, ViewSizes p_ViewSizes = ViewSizes.VS_0240x0320) {
			Responses response = Responses.NONE;
			p_App.RunApplication(new QuestionApplication(p_Question, (r) => {
				response = r;
			}, p_Button, p_ViewSizes), app => {
				app.ShowDialog();
			});

			return response;
		}
	}
}