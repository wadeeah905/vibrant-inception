<%@ Control Language="C#" Inherits="Crm.Library.Modularization.CrmViewUserControl`1[[Crm.Service.ViewModels.ServiceOrderMaterialViewModel, Crm.Service]]" %>
<%@ Import Namespace="System.Globalization" %>
<%@ Import Namespace="Crm.Article.Model.Lookups" %>
<%@ Import Namespace="Crm.Library.Extensions" %>
<%@ Import Namespace="Crm.Library.Globalization.Extensions" %>
<%@ Import Namespace="Crm.Service.Model.Lookup" %>
<%@ Import Namespace="Crm.Library.Model.Authorization.PermissionIntegration" %>
<%@ Import Namespace="Crm.Model.Extensions" %>
<%@ Import Namespace="Crm.Service" %>
<%@ Import Namespace="Crm.Model.Lookups" %>

<% var material = Model.Item;
	 var totalPrice = material.Price.HasValue && !material.InvoiceQty.EqualsDefault()
	                  	? material.InvoiceQty * material.Price.Value * (1 - material.DiscountPercent.ValueOrDefault() / 100)
	                  	: 0;
	 var postProcessing = LookupManager.Get<ServiceOrderStatus>(ServiceOrderStatus.PostProcessingKey);%>

<div id="service_material_wrapper_<%: material.Id %>" class="service_material_wrapper entry clearfix">

	<table class="w99">
		<tbody>
			<tr class="row">
				<td class="col-md-6">
					<p>
						<strong>
							<% if (Model.Item.Article != null ) { %>
								<a href="<%= Url.Action("Details", "Article", new { id = Model.Item.ArticleId, plugin = "Crm.Article" }) %>"><%: material.ItemNo %></a>
							<% } else { %>
								<span><%: material.ItemNo %></span>
							<% } %>
							<%= String.Format(" - {0}", material.Description) %><br />
						</strong>
					</p>
					<% if (material.IsSerial) { %>
						<%= Html.Localize("Serials") %>
						<ul class="serial-list">
							<% foreach (var materialSerial in material.ServiceOrderMaterialSerials) { %>
								<li>
									<span>
										<% var previousSerialNo = materialSerial.PreviousSerialNo ?? materialSerial.NoPreviousSerialNoReason.Value; %>
										<%= $"{materialSerial.SerialNo} ({Html.Localize("was")}: {previousSerialNo})"  %>
									</span>
								</li>
							<% } %>
						</ul>
					<% } %>
					<span class="gray">
						<% if (material.ServiceOrderTime != null) { %>
						<% var time = material.ServiceOrderTime; %>
						<% if (time.Installation != null) { %>
						<%= String.Format("{0} <a href=\"{1}\">{2}</a> / {3}</br><a href=\"{4}\">{5}</a> {6} {7} {8} {9}",
										Html.Localize("for"),
										Url.Action("Details", "Installation", new { id = time.Installation.Id, plugin = "Crm.Service" }),
										time.Installation.FullDescription,
										time.Description,
										Url.Action("Details", "Article", new { id = time.ArticleId, plugin = "Crm.Article"}),
										time.ItemNo,
										Html.Localize("by"),
										Model.UsersToDisplay.GetById(time.CreateUser)?.DisplayName??time.CreateUser,
										Html.Localize("atDate"),
										time.CreateDate.ToShortDateString()) %>
						<% }
						else { %>
						<%= String.Format("{0}<a href=\"{1}\">{2}</a> {3} {4} {5} {6}",
										time.Description,
										Url.Action("Details", "Article", new { id = time.ArticleId, plugin = "Crm.Article"}),
										time.ItemNo,
										Html.Localize("by"),
										Model.UsersToDisplay.GetById(time.CreateUser)?.DisplayName??time.CreateUser,
										Html.Localize("atDate"),
										time.CreateDate.ToShortDateString()) %>
						<% } %>
						<% } %>
					</span>
					<%= String.Format("<p>{0}: {1}</p>", Html.Localize("InternalRemark"), material.InternalRemark).If(material.InternalRemark.IsNotNullOrWhiteSpace()) %>
					<%= String.Format("<p>{0}: {1}</p>", Html.Localize("ExternalRemark"), material.ExternalRemark).If(material.ExternalRemark.IsNotNullOrWhiteSpace()) %>
					<%= String.Format("<p>{0}: {1}</p>", Html.Localize("Store"), material.FromWarehouse).If(material.FromWarehouse.IsNotNullOrWhiteSpace()) %>
					<%= String.Format("<p>{0}: {1}</p>", Html.Localize("Location"), material.FromLocation).If(material.FromLocation.IsNotNullOrWhiteSpace()) %>
 
				</td>
				<td class="col-md-2">
					<% var unit = material.QuantityUnit != null ? material.QuantityUnit.Value : LookupManager.Instance.Get<QuantityUnit>(QuantityUnit.PiecesKey); %>
					<table class="w99">
						<tr>
							<td>
								<%= Html.Localize("EstimatedQty") %>
							</td>
							<td class="text-right">
								<%= String.Format("<strong>{0}</strong> {1}", material.EstimatedQty.ToString("n", CultureInfo.GetCultureInfo(Model.User.DefaultLanguage.Key).NumberFormat), unit) %>
							</td>
						</tr>
						<tr>
							<td>
								<%= Html.Localize("ActualQty") %>
							</td>
							<td class="text-right">
								<%= String.Format("<strong>{0}</strong> {1}", material.ActualQty.ToString("n", CultureInfo.GetCultureInfo(Model.User.DefaultLanguage.Key).NumberFormat), unit) %>
							</td>
						</tr>
						<tr>
							<td>
								<%= Html.Localize("InvoiceQty") %>
							</td>
							<td class="text-right">
								<%= String.Format("<strong>{0}</strong> {1}", material.InvoiceQty.ToString("n", CultureInfo.GetCultureInfo(Model.User.DefaultLanguage.Key).NumberFormat), unit) %>
							</td>
						</tr>
					</table>
				</td>
						<%--<a style="color:#6d6d6d;" href="<%= Url.Action("ServiceOrderMaterialSerialsEdit", "ServiceOrderMaterial", new { id = material.Id, plugin = "Crm.Service" }) %>" id="UnFoldSerials-<%: material.Id %>" class="displayyes" onclick="MaterialSerials.editor('#<%=material.Id %>', $(this)); return false;">
							<%= Html.Localize("Serials") %>
						</a>--%>
				<td class="text-right col-md-1">
      		<%= Html.Localize("SinglePrice") %>
					<br />
					<br />
					<%= Model.Item.Price.HasValue ? Model.Item.Price.Value.ToString("n", CultureInfo.GetCultureInfo(Model.User.DefaultLanguage.Key).NumberFormat) : 0.ToString("n", CultureInfo.GetCultureInfo(Model.User.DefaultLanguage.Key).NumberFormat) %>
					<% if (Model.Item.CurrencyKey != null) { %>
						<%= LookupManager.Instance.Get<Currency>(Model.Item.CurrencyKey).Value %>
					<% } %>
				</td>
				<td class="text-right col-md-1">
      		<%= Html.Localize("DiscountPercent") %>
					<br />
					<br />
					<%= Model.Item.DiscountPercent.HasValue ? Model.Item.DiscountPercent.Value.ToString("n", CultureInfo.GetCultureInfo(Model.User.DefaultLanguage.Key).NumberFormat) : 0.ToString("n", CultureInfo.GetCultureInfo(Model.User.DefaultLanguage.Key).NumberFormat) %>
				</td>
				<td class="text-right col-md-1">
      		<%= Html.Localize("TotalPrice") %>
					<br />
					<br />
					<%= totalPrice.ToString("n", CultureInfo.GetCultureInfo(Model.User.DefaultLanguage.Key).NumberFormat) %>
				</td>
				<td class="text-right col-md-1">
					<% if (Model.AuthorizationManager.IsAuthorizedForAction(Model.User, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Edit) && Model.OrderStatus.SortOrder <= postProcessing.SortOrder)
						 { %>
						<p>
							<a class="material-edit" href="<%= Url.Action("ServiceOrderMaterialEdit", "ServiceOrderMaterial", new { plugin = "Crm.Service", id = material.Id.ToString() }) %>">
								<%= Html.Localize("Edit") %>
							</a>
						</p>
					<% } %>
					
					<% if (Model.AuthorizationManager.IsAuthorizedForAction(Model.User, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Edit) && Model.OrderStatus.SortOrder <= postProcessing.SortOrder)
						 { %>
						<p>
							<a class="material-delete" href="<%= Url.Action("ServiceOrderMaterialDelete", "ServiceOrderMaterial", new { plugin = "Crm.Service", id = material.Id }) %>">
								<%= Html.Localize("Delete") %>
							</a>
						</p>
					<% } %>
				</td>
			</tr>
		</tbody>
	</table>

	<div class="service-material-edit-body">
		<!-- placeholder for edit body -->
	</div>

	<div id="<%: material.Id.ToString() %>">
		<!-- placeholder for serials -->
	</div>

</div>