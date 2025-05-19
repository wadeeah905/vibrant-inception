
﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using LMobile.MiniForms;
using LMobile.Gen3LicenseManagement.Portal.BusinessObjects;
using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;
using LMobile.MiniForms.Classic;
using System.Drawing;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Modules {
	class ModulesView : ApplicationView<BaseView, ModulesApplication> {
		public readonly BindingSource<TreeWrapper<Module, ModuleProperty>> Modules;
		public readonly BindingSource<ModuleProperty> Properties;
		public ModulesView() {
			this.Modules = this.CreateCollectionBindingSource(Application, app => app.Modules);
			this.Properties = CreateCollectionBindingSource(Modules, module => module.Children);
		}

		protected override void Render(BaseView master) {
			master.BackButton.BindAction(Application, app => app.ExitApplication());

			var main = master.Content.AddLinesLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.H100);

			#region Module
			var editor = main.AddColumnsLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.SectionBody + new Style() { HorizontalSpacing = new Length(5, In.Points) });
			var editorFields = editor.AddTableLayout().SetStyle(ClassicStyleSheet.WRemainder)
					.BindDisplayed(Application, app => app.CurrentModule != null);
			editorFields.AddRow(row => {
				row.AddLabel().SetCaption(Resources.ProjectType());
				row.AddDropDownBox<StoredProjectType>(pt => pt.ProjectType)
					.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in7)
					.BindEnabled(Application, app => app.CanUserEditModule)
					.BindItems(Application, app => app.ProjectTypes)
					.BindSelectedItem(Application, app => app.CurrentModule == null ? null : app.ProjectTypes.FirstOrDefault(pt => pt.ProjectType == app.CurrentModule.ProjectType), false,
										 (app, value) => app.CurrentModule.ProjectType = value.ProjectType);
			});
			editorFields.AddRow(row => {
				row.AddLabel().SetCaption(Resources.Name());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in2)
					.BindReadOnly(Application, app => !app.CanUserEditModule)
					.BindText(Application, app => app.CurrentModule == null ? null : app.CurrentModule.ModuleName, false, (app, value) => app.CurrentModule.ModuleName = value);
			});
			editorFields.AddRow(row => {
				row.AddLabel().SetCaption(Resources.Description());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in2)
					.BindReadOnly(Application, app => !app.CanUserEditModule)
					.BindText(Application, app => app.CurrentModule == null ? null : app.CurrentModule.Description, false, (app, value) => app.CurrentModule.Description = value);
			});

			// Instead of a collapsible section, just show the GUID in small font
			editorFields.AddRow(row => {
				var guidRow = row.AddLinesLayout().Span(2, 1);
				guidRow.AddLabel()
					.SetCaption(string.Format("{0}: ", Resources.Guid()))
					.SetStyle(new Style { FontSize = new Length(8, In.Points) });
				guidRow.AddLabel()
					.SetStyle(new Style { FontSize = new Length(8, In.Points) })
					.BindCaption(Application, app => app.CurrentModule == null ? null : app.CurrentModule.ModuleGuid.ToString());
			});

			var editorButtons = editor.AddLinesLayout().BindDisplayed(Application, app => app.CurrentModule != null);
			editorButtons.AddActionButton()
					.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.Disk))
					.BindDisplayed(Application, app => app.CanUserEditModule)
					.BindAction(Application, app => app.SaveCurrentModule());
			editorButtons.AddActionButton()
					.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.ArrowLeft))
					.BindDisplayed(Application, app => app.CanUserEditModule)
					.BindAction(Application, app => app.ResetCurrentModule());
			#endregion

			#region Module-Property
			var propertyEditor = main.AddColumnsLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.SectionBody + new Style() { HorizontalSpacing = new Length(5, In.Points) });
			var propertyEditorFields = propertyEditor.AddTableLayout().SetStyle(ClassicStyleSheet.WRemainder)
					.BindDisplayed(Application, app => app.CurrentModuleProperty != null);
			propertyEditorFields.AddRow(row => {
				row.AddLabel().SetCaption(Resources.Name());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in2)
					.BindReadOnly(Application, app => !app.CanUserEditModule)
					.BindText(Application, app => app.CurrentModuleProperty == null ? null : app.CurrentModuleProperty.PropertyName, false, (app, value) => app.CurrentModuleProperty.PropertyName = value);
			});
			propertyEditorFields.AddRow(row => {
				row.AddLabel().SetCaption(Resources.Description());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in2)
					.BindReadOnly(Application, app => !app.CanUserEditModule)
					.BindText(Application, app => app.CurrentModuleProperty == null ? null : app.CurrentModuleProperty.Description, false, (app, value) => app.CurrentModuleProperty.Description = value);
			});
			var propertyEditorButtons = propertyEditor.AddLinesLayout().BindDisplayed(Application, app => app.CurrentModuleProperty != null);
			propertyEditorButtons.AddActionButton()
					.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.Disk))
					.BindDisplayed(Application, app => app.CanUserEditModule)
					.BindAction(Application, app => app.SaveCurrentModuleProperty());
			propertyEditorButtons.AddActionButton()
					.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.ArrowLeft))
					.BindDisplayed(Application, app => app.CanUserEditModule)
					.BindAction(Application, app => app.ResetCurrentModuleProperty());
			#endregion

			#region ModuleProperty-List
			var scroll = main.AddScrollPanel(Scrolling.Vertical).SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.HRemainder + 
				new Style { RightPadding = new Length(25, In.Pixels) }); // Increased right padding to avoid scrollbar overlap
			
			var modules = scroll.Layout.AddTableLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.SectionBody + 
				new Style { VerticalSpacing = new Length(4, In.Points) });
			
			modules.AddRow(row => {
				row.SetChildStyle(ClassicStyleSheet.Bold);
				row.AddLabel().SetStyle(new Style { Width = new Length(25, In.Pixels) }); // Space for expand/collapse button
				row.AddLabel().SetCaption(Resources.ProjectType());
				row.AddLabel().SetCaption(Resources.Description());
				
				// Add "Action" text for edit button column
				row.AddLabel().SetCaption(Resources.Actions()).SetStyle(new Style { Width = new Length(70, In.Pixels) }); // Width for Edit button label
				
				// Add "Action" text for add button column
				row.AddLabel().SetCaption(Resources.Actions()).SetStyle(new Style { Width = new Length(70, In.Pixels) }); // Width for Add button label
			});
			this.AddIteration(Modules, () => {
				modules.AddRow(row => {
					row.AddToggleButton().SetStyle(ClassicStyleSheet.ExpandCollapseSmall)
						.BindChecked(Modules, module => module.Expanded, true, (project, value) => project.Expanded = value);

					// Combined ProjectType and Name in one cell for better display
					row.AddLabel()
						.BindCaption(Modules, module => module.Node.ProjectType);

					// Description in its own cell
					row.AddLabel()
						.BindCaption(Modules, module => module.Node.Description)
						.SetStyle(ClassicStyleSheet.WRemainder);

					// Edit button with increased width and even more left margin
					row.AddActionButton()
						.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.Pencil) + 
							new Style { 
								Width = new Length(60, In.Pixels), 
								RightMargin = new Length(35, In.Pixels) 
							})
						.BindAction(Application, Modules, (app, module) => app.NavigateEditModule(module.Node.ID));

					// Add Property button with increased width and even more left margin
					row.AddActionButton()
						.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.Plus) + 
							new Style { 
								Width = new Length(60, In.Pixels), 
								RightMargin = new Length(45, In.Pixels) 
							})
						.BindAction(Application, Modules, (app, module) => app.NavigateEditModuleProperty(module.Node.ID, 0));

				}).SetStyle(new Style { Border = new Length(1, In.Pixels), BorderColor = Color.Black });

				modules.AddRow(row => {
					row.BindDisplayed(Modules, module => module.Expanded);
					row.AddLabel();

					var propertyTable = row.AddTableLayout().Span(4, 1).SetStyle(new Style {
						LeftMargin = new Length(20, In.Pixels),
						BackgroundColor = Color.LightGray,
						RightMargin = new Length(25, In.Pixels) // Add right margin to property table
					});

					propertyTable.AddRow(propRow => {
						propRow.SetChildStyle(ClassicStyleSheet.Bold);
						propRow.AddLabel().SetCaption(Resources.Name()).SetStyle(new Style { Width = new Length(120, In.Pixels) });
						propRow.AddLabel().SetCaption(Resources.Description());
						// Add "Action" text for buttons column with more width
						propRow.AddLabel().SetCaption(Resources.Actions()).SetStyle(new Style { Width = new Length(150, In.Pixels) }); // Increased width for buttons column
					});

					propertyTable.AddIteration(Properties, i => {
						propertyTable.AddRow(propRow => {
							propRow.AddLabel()
								 .BindCaption(Properties, prop => prop.PropertyName)
								 .SetStyle(new Style { Width = new Length(120, In.Pixels) });

							propRow.AddLabel()
								 .BindCaption(Properties, prop => prop.Description)
								 .SetStyle(ClassicStyleSheet.WRemainder);

							// Button layout with more controlled spacing and even further left
							var btnLayout = propRow.AddColumnsLayout().SetStyle(new Style { Width = new Length(150, In.Pixels) }); // Increased width
							btnLayout.AddActionButton().SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.Pencil) + 
								new Style { 
									Width = new Length(60, In.Pixels), 
									RightMargin = new Length(20, In.Pixels) 
								})
								.BindAction(Application, Modules, Properties, (app, module, prop) => app.NavigateEditModuleProperty(module.Node.ID, prop.ID));
							
							btnLayout.AddActionButton().SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.Bin) + 
								new Style { 
									Width = new Length(60, In.Pixels), 
									RightMargin = new Length(30, In.Pixels) 
								})
								.BindAction(Application, Modules, Properties, (app, module, prop) => app.RemoveExistingModulePropertyFromModule(module.Node, prop));
						});
					});

					propertyTable.AddRow(propRow => {
						propRow.AddDropDownBox<ModuleProperty>(x => string.Format("{0} - ({1})", x.PropertyName, x.Description))
								.Span(2, 1)
								.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in2)
								.BindItems(Application, Modules, (app, module) => app.AllModulePropertiesExceptCurrentModule(module.Node))
								.BindSelectedItem(Application, app => app.CurrentSelectedModuleProperty, false, (app, prop) => app.CurrentSelectedModuleProperty = prop);

						// Add button with increased width and even more right margin - moved further left
						propRow.AddActionButton().SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.Plus) + 
							new Style { 
								Width = new Length(60, In.Pixels), 
								RightMargin = new Length(50, In.Pixels) 
							})
								.BindAction(Application, Modules, (app, module) => app.AddExistingModulePropertyToModule(module.Node, app.CurrentSelectedModuleProperty));
					});
				});

				modules.AddRow(row => {
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
			#endregion

			master.Navigation.AddActionButton()
						.SetCaption(Resources.NewModule())
						.BindAction(Application, app => app.NavigateEditModule(0));
			master.Navigation.AddActionButton()
						.SetCaption(Resources.NewModuleProperty())
						.BindAction(Application, app => app.NavigateEditModuleProperty(0, 0));
		}
	}
}
