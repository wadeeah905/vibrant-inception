///<reference path="../../../../../Crm.Web/Content/@types/index.d.ts"/>
import {namespace} from "../../../../Content/ts/namespace";

export default class ArticleDetailsViewModelExtension extends window.Crm.Article.ViewModels.ArticleDetailsViewModel {

	constructor() {
		super();
	}

	async onSaveArticleServiceExtensions(data) {
		if (data.editContext().article().ExtensionValues().IsDefaultForServiceOrderTimes()) {
			await window.database.CrmArticle_Article
				.filter("it.ExtensionValues.IsDefaultForServiceOrderTimes === true && it.Id !== this.id", {id: data.editContext().article().Id()})
				.forEach(article => {
					window.database.attachOrGet(article);
					article.ExtensionValues.IsDefaultForServiceOrderTimes = false;
				});
		}
		return Promise.resolve();
	};
}
namespace("Crm.Article.ViewModels").ArticleDetailsViewModel = ArticleDetailsViewModelExtension;
