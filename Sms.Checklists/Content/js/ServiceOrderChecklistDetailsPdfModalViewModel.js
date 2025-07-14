namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsPdfModalViewModel = function (parentViewModel) {
	var viewModel = this;
	ko.bindingHandlers.storeElement = {
		init: function (element, valueAccessor) {
			valueAccessor()(element);
		}
	}
	viewModel.serviceOrderChecklist = ko.observable();
	viewModel.pageNum = ko.observable(1);
	viewModel.pdfDoc = ko.observable(null);
	viewModel.pageRendering = ko.observable(false);
	viewModel.pageNumPending = ko.observable(null);
	viewModel.pageCount = ko.observable(0);
	viewModel.currentPage = ko.observable();
	viewModel.isPreview = ko.observable(false);
	viewModel.fileResourceId = ko.observable(null);
	viewModel.languageBeforeChange = ko.observable();

	viewModel.DynamicForm = window.ko.observable(null);
	viewModel.selectedLanguage = window.ko.observable(null);
	viewModel.languages = window.ko.observableArray([]);
	viewModel.previewText = ko.computed(function () {
		return window.Helper.String.getTranslatedString(("PreviewText"), "Error: Translation of 'PreviewText' not found", viewModel.selectedLanguage());
	});

	if (window.FileRepository) {
		viewModel.fileRepository = new window.FileRepository();
	}
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsPdfModalViewModel.prototype.init = async function (id) {
	var viewModel = this;

	var serviceOrderChecklist = await window.database.SmsChecklists_ServiceOrderChecklist
		.include("DynamicForm")
		.include2("DynamicForm.Languages.filter(function(x) { return x.StatusKey == 'Released' })")
		.find(id);

	viewModel.serviceOrderChecklist(serviceOrderChecklist.asKoObservable());
	viewModel.DynamicForm(serviceOrderChecklist.DynamicForm.asKoObservable());

	var language = await window.Helper.Culture.languageCulture()
	viewModel.selectedLanguage(language);

	var lookup = await window.Helper.Lookup.getLocalizedArrayMap("Main_Language", language);
	viewModel.languages(lookup);

	var fileResponses = await window.database.CrmDynamicForms_DynamicFormFileResponse
		.filter("it.DynamicFormReferenceKey === this.id", { id: viewModel.serviceOrderChecklist().Id() })
		.orderByDescending("it.ModifyDate")
		.toArray();

	if (fileResponses.length == 0) {
		viewModel.isPreview(true);
		viewModel.fileResourceId(viewModel.getDynamicFormFileResourceId(viewModel.DynamicForm(), viewModel.selectedLanguage()));
		if (viewModel.DynamicForm().Languages().filter(x => x.LanguageKey() == viewModel.selectedLanguage())[0] == undefined) {
			viewModel.selectedLanguage(viewModel.DynamicForm().DefaultLanguageKey());
			viewModel.languageBeforeChange(viewModel.DynamicForm().DefaultLanguageKey());
		}
	} else {
		var languageResponse = fileResponses.filter(x => x.LanguageKey == viewModel.selectedLanguage());
		if (languageResponse[0] != undefined) {
			viewModel.fileResourceId(languageResponse[0].FileResourceId)
		} else {
			var defaultLanguageResponse = fileResponses.filter(x => x.LanguageKey == viewModel.DynamicForm().DefaultLanguageKey());
			viewModel.fileResourceId(defaultLanguageResponse[0].FileResourceId);
			viewModel.selectedLanguage(viewModel.DynamicForm().DefaultLanguageKey());
			viewModel.languageBeforeChange(viewModel.DynamicForm().DefaultLanguageKey());
		}
	}
	var fileResource = await window.database.Main_FileResource
		.find(viewModel.fileResourceId());

	var file = await window.Sms.Checklists.ViewModels.ServiceOrderChecklistEditPdfModalViewModel.prototype.getFileFromRepositoryOrServer(fileResource);
	var base64data = await window.Helper.String.blobToBase64(file);
	viewModel.showPdf(base64data);
};


namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsPdfModalViewModel.prototype.getFileResponsesFileResourceId = function (responses, selectedLanguage) {
	var result = null;
	var languageExists = false;

	if (responses.length == 1) {
		result = responses[0].FileResourceId;
	} else {
		responses.forEach(function (response) {
			if (response.LanguageKey == selectedLanguage) {
				result = response.FileResourceId;
				languageExists = true;
			}
		})
	}
	if (languageExists == false) {
		result = responses[0].FileResourceId;
	}

	return result;
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsPdfModalViewModel.prototype.getDynamicFormFileResourceId = function (dynamicForm, selectedLanguage) {
	var result = null;
	dynamicForm.Languages().forEach(function (language) {
		if (language.LanguageKey() == selectedLanguage) {
			result = language.FileResourceId();
		}
	})
	if (result == null) {
		var defaultFileResourceId = dynamicForm.Languages().filter(x => x.LanguageKey() == dynamicForm.DefaultLanguageKey());
		result = defaultFileResourceId[0].FileResourceId();
	}
	return result;
};

/**
 * expects a Pdf as a base64string and displays the PDF in the canvas element
 * @param {string} base64string
 */
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsPdfModalViewModel.prototype.showPdf = function (base64string) {
	var viewModel = this;

	viewModel.pageNum(1);
	var pdfData = atob(base64string);
	viewModel.pdfDoc(null);

	pdfjsLib.GlobalWorkerOptions.workerSrc = window.Helper.Url.resolveUrl("~/Plugins/Crm.DynamicForms/Content/js/pdfjs/build/pdf.worker.js");

	pdfjsLib.getDocument({ data: pdfData }).promise
		.then(function (pdfDoc_) {
			viewModel.pdfDoc(pdfDoc_);
			viewModel.renderPage(viewModel.pageNum());
			viewModel.pageCount(viewModel.pdfDoc().numPages);
		});
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsPdfModalViewModel.prototype.renderPage = function (num) {
	var viewModel = this;
	viewModel.pageRendering(true);

	var scale = 1.25,
		canvas = document.getElementById("myCanvas"),
		ctx = canvas.getContext('2d');

	// Using promise to fetch the page
	viewModel.pdfDoc().getPage(num)
		.then(function (page) {
			var viewport = page.getViewport({ scale: scale });
			canvas.height = viewport.height;
			canvas.width = viewport.width;

			// Render PDF page into canvas context
			var renderContext = {
				canvasContext: ctx,
				viewport: viewport
			};

			var renderTask = page.render(renderContext);
			// Wait for rendering to finish
			renderTask.promise
				.then(function () {
					viewModel.pageRendering(false)
					if (viewModel.pageNumPending() !== null) {
						// New page rendering is pending
						viewModel.renderPage(viewModel.pageNumPending());
						viewModel.pageNumPending(null);
					}
				})
				.catch(function (error) {
					window.Log.error(error);
				});
		});

	// Update page counters
	viewModel.currentPage(num);
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsPdfModalViewModel.prototype.queueRenderPage = function (num) {
	var viewModel = this;
	if (viewModel.pageRendering()) {
		viewModel.pageNumPending(num);
	} else {
		viewModel.renderPage(num);
	}
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsPdfModalViewModel.prototype.onNextPage = function () {
	var viewModel = this;
	if (viewModel.pageNum() >= viewModel.pdfDoc().numPages) {
		return;
	}
	viewModel.pageNum(viewModel.pageNum() + 1);
	viewModel.queueRenderPage(viewModel.pageNum());
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsPdfModalViewModel.prototype.onPrevPage = function () {
	var viewModel = this;
	if (viewModel.pageNum() <= 1) {
		return;
	}
	viewModel.pageNum(viewModel.pageNum() - 1);
	viewModel.queueRenderPage(viewModel.pageNum());
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsPdfModalViewModel.prototype.hasNextPage = function () {
	var viewModel = this;
	return viewModel.pageNum() !== viewModel.pageCount();
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsPdfModalViewModel.prototype.hasPrevPage = function () {
	var viewModel = this;
	return viewModel.pageNum() !== 1;
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsPdfModalViewModel.prototype.changeLanguage = async function () {
	var viewModel = this;
	var oldCanvas = document.getElementById("myCanvas");
	var newCanvas = document.createElement("canvas");
	newCanvas.style = "width: 100%";
	newCanvas.id = oldCanvas.id;
	oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);

	var fileResponses = await window.database.CrmDynamicForms_DynamicFormFileResponse
		.filter("it.DynamicFormReferenceKey === this.id && it.LanguageKey == selectedLanguage ", { id: viewModel.serviceOrderChecklist().Id(), selectedLanguage: viewModel.selectedLanguage() })
		.orderByDescending("it.ModifyDate")
		.toArray();
	if (fileResponses.length == 0) {
		viewModel.isPreview(true);
		viewModel.fileResourceId(viewModel.getDynamicFormFileResourceId(viewModel.DynamicForm(), viewModel.selectedLanguage()));
	} else {
		viewModel.fileResourceId(fileResponses[0].FileResourceId);
		viewModel.isPreview(false);
	}
	var fileResource = await window.database.Main_FileResource
		.find(viewModel.fileResourceId());

	var file = await window.Sms.Checklists.ViewModels.ServiceOrderChecklistEditPdfModalViewModel.prototype.getFileFromRepositoryOrServer(fileResource);
	viewModel.pageNum = ko.observable(1);

	var base64data = await window.Helper.String.blobToBase64(file);
	viewModel.showPdf(base64data);
};
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsPdfModalViewModel.prototype.downloadPdf = async function () {
	var viewModel = this;
	var fileResource = await window.database.Main_FileResource
		.find(viewModel.fileResourceId());
	var file = await window.Sms.Checklists.ViewModels.ServiceOrderChecklistEditPdfModalViewModel.prototype.getFileFromRepositoryOrServer(fileResource);
	download(file, fileResource.Filename, "application/pdf");
};


