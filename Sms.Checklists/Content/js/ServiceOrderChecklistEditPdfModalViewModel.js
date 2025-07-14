/// <reference path="../../../../Content/js/system/knockout-3.5.1.js" />
/// <reference path="../../../../Content/js/knockout.wrap.js" />
/// <reference path="../../../../Content/js/system/jquery-1.11.3.min.js" />
/// <reference path="../../../../Content/js/system/jquery-1.11.3.min.js" />
/// <reference path="../../../Crm.Offline/Content/js/FileRepository.js" />
/// <reference path="../../../Crm.Service/Content/js/DispatchDetailsViewModel.js" />

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel = function (parentViewModel) {
	var viewModel = this;
	if (parentViewModel !== null) {
		viewModel.dispatch = parentViewModel.dispatch;
		viewModel.serviceOrder = parentViewModel.serviceOrder;
	}
	viewModel.loading = ko.observable(true);
	viewModel.showSigning = ko.observable(false);
	viewModel.currentSignatureName = ko.observable(null);
	viewModel.serviceOrderChecklist = ko.observable();
	viewModel.objectUrl = ko.observable();
	viewModel.pdfFile = ko.observable();
	viewModel.annotations = ko.observableArray([]);
	viewModel.fileResources = ko.observableArray([]);
	viewModel.languageBeforeChange = ko.observable();
	viewModel.DynamicForm = window.ko.observable(null);
	viewModel.selectedLanguage = window.ko.observable(null);
	viewModel.languages = window.ko.observableArray([]);
	viewModel.currentPdfwasSigned = ko.observable(false);

	if (window.FileRepository) {
		viewModel.fileRepository = new window.FileRepository();
	}

	viewModel.loadInitalPdfInViewer = function (e) {
		e.detail.source.PDFViewerApplication.initializedPromise
			.then(function () {
				requestAnimationFrame(function () {
					e.detail.source.PDFViewerApplication.open(viewModel.objectUrl())
					var PDFViewerApplication = document.getElementsByTagName("iframe")[0].contentWindow.PDFViewerApplication;
					PDFViewerApplication.eventBus.on("annotationlayerrendered", function () {
						viewModel.checkForSigning(viewModel.objectUrl())
						var inputFields = document.getElementsByTagName("iframe")[0].contentDocument.getElementsByTagName("input");
						for (var i = 0; i < inputFields.length; i++) {
							inputFields[i].setAttribute("autocomplete", "off");
							if (inputFields[i].name.startsWith("Unterschrift")) {
								inputFields[i].setAttribute("readonly", "true");
							}
						}
						var resetButtons = document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("internalLink");

						while (resetButtons[0]) {
							resetButtons[0].parentNode.removeChild(resetButtons[0]);
						};

					})
				})
			})
	}

	ko.bindingHandlers.storeElement = {
		init: function (element, valueAccessor) {
			valueAccessor()(element);
		}
	}
	viewModel.signaturePad = ko.observable();
};
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.init = async function (id) {
	var viewModel = this;
	if (window.FileRepository) {
		await viewModel.fileRepository.init();
	}
	var serviceOrderChecklist = await window.database.SmsChecklists_ServiceOrderChecklist
		.include("DynamicForm")
		.include2("DynamicForm.Languages.filter(function(x) { return x.StatusKey == 'Released'})")
		.include("ServiceOrderTime.Installation")
		.find(id);

	window.database.attachOrGet(serviceOrderChecklist);
	viewModel.serviceOrderChecklist(serviceOrderChecklist.asKoObservable());
	viewModel.DynamicForm(serviceOrderChecklist.DynamicForm.asKoObservable());

	var language = await window.Helper.Culture.languageCulture();
	viewModel.selectedLanguage(language);
	viewModel.languageBeforeChange(language);

	var lookup = await window.Helper.Lookup.getLocalizedArrayMap("Main_Language", language);
	viewModel.languages(lookup);

	var fileResponse = await window.database.CrmDynamicForms_DynamicFormFileResponse
		.filter("it.DynamicFormReferenceKey === this.id", { id: viewModel.serviceOrderChecklist().Id() })
		.orderByDescending("it.ModifyDate")
		.toArray();

	if ((viewModel.DynamicForm().Languages().filter(x => x.LanguageKey() == viewModel.selectedLanguage())[0] == undefined) && (fileResponse.filter(x => x.LanguageKey == viewModel.selectedLanguage())[0] == undefined)) {
		viewModel.selectedLanguage(viewModel.DynamicForm().DefaultLanguageKey());
		viewModel.languageBeforeChange(viewModel.DynamicForm().DefaultLanguageKey());
	}

	await Promise.all(viewModel.DynamicForm().Languages().map(async (dynamicFormLanguage) => {

		var existingFileResponse = ko.utils.arrayFirst(fileResponse, function (data) {
			return data.LanguageKey == dynamicFormLanguage.LanguageKey();
		});
		if (existingFileResponse) {
			// take pdf from fileResponse
			var fileResource = await window.database.Main_FileResource
				.find(existingFileResponse.FileResourceId);
			var blob = await viewModel.getFileFromRepositoryOrServer(fileResource);
			var base64 = await window.Helper.String.blobToBase64(blob);
			viewModel.fileResources.unshift({
				"fileResourceContent": base64,
				"language": dynamicFormLanguage.LanguageKey(),
				"Filename": fileResource.Filename
			});
		} else {
			// take pdf from dynamic form
			var fileResource = await window.database.Main_FileResource
				.find(dynamicFormLanguage.FileResourceId());
			var blob = await viewModel.getFileFromRepositoryOrServer(fileResource);
			var base64 = await window.Helper.String.blobToBase64(blob);
			var filledPdf = await viewModel.fillPdf(base64);
			viewModel.fileResources.unshift({
				"fileResourceContent": filledPdf,
				"language": dynamicFormLanguage.LanguageKey(),
				"Filename": fileResource.Filename
			});
		}
	}));


	var base64data = ko.utils.arrayFirst(viewModel.fileResources(), function (data) {
		return data.language == viewModel.selectedLanguage();
	});
	viewModel.showPdf(base64data.fileResourceContent);
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.showPdf = function (base64data) {
	var viewModel = this;
	var blob = window.Helper.String.base64toBlob(base64data, "application/pdf");
	viewModel.objectUrl(window.URL.createObjectURL(blob));
	document.addEventListener("webviewerloaded", viewModel.loadInitalPdfInViewer);
};


namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.getFileFromRepositoryOrServer = function (fileResource) {
	var deferred = new $.Deferred();
	var result = null;
	if (window.Helper.Offline == undefined || window.Helper.Offline.status == "online") {
		fetch(window.Helper.resolveUrl("~/File/File/" + fileResource.Id))
			.then(function (response) {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response.blob();
			})
			.then(function (file) {
				deferred.resolve(file);
			})
			.fail(function (error) {
				window.Log.debug(error);
				deferred.reject();
			})
	} else {
		if (fileResource.Content !== null) {
			var blob = window.Helper.String.base64toBlob(fileResource.Content, "application/pdf");
			deferred.resolve(blob);
		} else {
			var fileRepository = new window.FileRepository();
			fileRepository.init()
				.then(function () {
					return fileRepository.getFile(fileResource.Id, fileResource.Filename);
				})
				.then(function (fileEntry) {
					// this part is working on windows and android devices
					if (fileEntry.File !== undefined) {
						result = fileEntry.File;
						deferred.resolve(result);
					} else { // this part is for getting the files on apple devices. At the moment it isn't working in Offline-Mode
						fileEntry.file(function (file) {
							var reader = new FileReader();
							reader.onloadend = function () {
								var blob = new Blob([new Uint8Array(this.result)], { type: "application/pdf" });
								deferred.resolve(blob);
							};
							reader.readAsArrayBuffer(file);
						}, function (e) {
							window.Log.error(e);
							deferred.reject();
						});
					}
				})
				.fail(function (error) {
					window.Log.error(error);
					deferred.reject();
				})
		}
	}
	return deferred.promise(result);
};


namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.dispose = function () {
	var viewModel = this;
	document.removeEventListener("webviewerloaded", viewModel.loadInitalPdfInViewer);
	window.Log.debug("Removed webviewerloaded-Eventlistener");
};


namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.saveOrComplete = async function (data, event) {
	var viewModel = this;
	viewModel.loading(true);
	if (event.target.id == "complete") {
		viewModel.serviceOrderChecklist().Completed(true);
	}

	var PDFViewerApplication = document.getElementsByTagName("iframe")[0].contentWindow.PDFViewerApplication;

	var data = await PDFViewerApplication.pdfDocument.saveDocument(PDFViewerApplication.pdfDocument.annotationStorage)
	const blob = new Blob([data], {
		type: "application/pdf"
	});
	var base64 = await window.Helper.String.blobToBase64(blob);
	await viewModel.getAnnotationStorgae(base64);

	var fileResourceToUpdate = ko.utils.arrayFirst(viewModel.fileResources(), function (data) {
		return data.language == viewModel.languageBeforeChange();
	});
	fileResourceToUpdate.fileResourceContent = base64;

	for (const data of viewModel.fileResources()) {
		if (data.language !== viewModel.languageBeforeChange()) {
			var newFileResourceContent = await viewModel.setAnnotationStorage(data.fileResourceContent);
			data.fileResourceContent = newFileResourceContent;
		}
		if (viewModel.serviceOrderChecklist().Completed()) {
			var flattenPdf = await viewModel.flattenPdf(data.fileResourceContent);
			data.fileResourceContent = flattenPdf;
		}
		var contentAsBlob = await window.Helper.String.base64toBlob(data.fileResourceContent, "application/pdf");

		var newFileResource = window.database.Main_FileResource.Main_FileResource.create();
		newFileResource.Content = data.fileResourceContent;
		newFileResource.ContentType = "application/pdf";
		newFileResource.Filename = data.Filename;
		newFileResource.OfflineRelevant = true;
		newFileResource.Length = contentAsBlob.size;
		window.database.add(newFileResource);

		if (window.FileRepository) {
			await viewModel.fileRepository.storeFile(newFileResource.Id, blob);
		}

		var fileResponses = await window.database.CrmDynamicForms_DynamicFormFileResponse
			.filter("it.DynamicFormReferenceKey === this.id && it.LanguageKey == selectedLanguage ", { id: viewModel.serviceOrderChecklist().Id(), selectedLanguage: data.language })
			.orderByDescending("it.ModifyDate")
			.toArray();
		if (fileResponses.length == 0) {
			var newFileResponse = window.database.CrmDynamicForms_DynamicFormFileResponse.CrmDynamicForms_DynamicFormFileResponse.create();
			newFileResponse.DynamicFormReferenceKey = viewModel.serviceOrderChecklist().Id();
			newFileResponse.LanguageKey = data.language;
			newFileResponse.FileResourceId = newFileResource.Id;
			window.database.add(newFileResponse);
		} else {
			var updateFileResponse = ko.utils.arrayFirst(fileResponses, function (response) {
				return response.LanguageKey == data.language;
			});
			window.database.attachOrGet(updateFileResponse);
			var fileResourceIdToRemove = updateFileResponse.FileResourceId;
			updateFileResponse.FileResourceId = newFileResource.Id;
			if (fileResourceIdToRemove !== null) {
				var fileResourceToRemove = await window.database.Main_FileResource
					.find(fileResourceIdToRemove);
				window.database.remove(fileResourceToRemove);
			}
		}
	};
	viewModel.annotations.removeAll();
	await window.database.saveChanges();
	window.Log.debug("Save PDF finished");
	viewModel.loading(false);
	$(".modal:visible").modal("hide");
};


/**
 * expects an url to a Pdf. The form fields of the PDF are flattend.
 * @param {Url} url
 * @returns flatten PDF as a base64
 */
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.flattenPdf = async function (base64data) {
	const { PDFDocument } = PDFLib;

	// Load a PDF with form fields
	const dataUri = 'data:application/pdf;base64,' + base64data;
	const pdfDoc = await PDFDocument.load(dataUri);

	// Get the form containing all the fields
	const form = pdfDoc.getForm();

	const fields = form.getFields();
	var fieldsToRemove = fields.filter(function (field) {
		return field.getName().startsWith("Unterschrift");
	})

	fieldsToRemove.forEach(function (field) {
		form.removeField(field);
	})

	// Flatten the form's fields
	form.flatten();

	// Serialize the PDFDocument to bytes (a Uint8Array)
	const pdfBytes = await pdfDoc.saveAsBase64();
	return pdfBytes;
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.fillPdf = async function (formUrl) {
	var viewModel = this;

	const { PDFDocument } = PDFLib;
	// Load a PDF with form fields
	const pdfDoc = await PDFDocument.load(formUrl);
	const form = pdfDoc.getForm();
	const fields = form.getFields();

	fields
		.filter(function (field) {
			return field instanceof PDFLib.PDFTextField && !field.getName().startsWith("untitled") && (field.getText() == "" || field.getText() == undefined);
		})
		.forEach(function (field) {
			var value = viewModel.getData(field.getName())
			if (value !== undefined) {
				field.setText(value);
			}
		})

	// enable readonly for all buttons to prevent resetting data in non-completed but already modified pdf-checklists (in Browser PDF-viewer)
	fields
		.filter(function (field) {
			return field instanceof PDFLib.PDFButton;
		})
		.forEach(function (field) {
			field.enableReadOnly();
		})

	// set values of all textfields and checkboxes again as otherwise prefilled default values are not rendered correctly
	fields
		.filter(function (field) {
			return field instanceof PDFLib.PDFTextField  || field instanceof PDFLib.PDFCheckBox;
		})
		.forEach(function (field) {
			if(field instanceof PDFLib.PDFTextField) {
				var value = field.getText();
				field.setText(value);
			}
			if(field instanceof PDFLib.PDFCheckBox) {
				if(field.isChecked()) {
					field.check();
				} else {
					field.uncheck();
				}
			}
	
		})

	// Serialize the PDFDocument to bytes (a Uint8Array)
	const pdfBytes = await pdfDoc.saveAsBase64();
	return pdfBytes;
};

/**
 * expects a string, which represents the hiearachy of the viewModel, seperated by an underline;
 * e.g. serviceOrder_Company_Name
 * which retuns the data behind viewModel.serviceOrder().Company().Name()
 * @param {string} name
 * @returns {string}
 */
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.getData = function (name) {
	var viewModel = this;

	/*name = "serviceOrder_Company_Addresses_0_City"*/
	var today = new Date();
	if (name == "Time") {
		return today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
	if (name == "Date") {
		return today.toLocaleDateString();
	}
	if (name == "Date_And_Time") {
		return today.toLocaleString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	}

	var routes = name.split("_");
	var result = getData(routes, viewModel);

	function getData(array, object) {
		if (array.length == 1) {
			if (ko.unwrap(object[array[0]]) == null) {
				return "";
			}
			return ko.unwrap(object[array[0]]);
		} else {
			var newArray = array.slice(1);
			if (ko.unwrap(object[array[0]]) == null) {
				return "";
			}
			return getData(newArray, ko.unwrap(object[array[0]]));
		}
	}

	if (Object.prototype.toString.call(result) === "[object Date]") {
		return result.toLocaleString();
	} else {
		return result;

	}
	return name;
};


namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.changeLanguage = async function (name) {
	var viewModel = this;

	var PDFViewerApplication = document.getElementsByTagName("iframe")[0].contentWindow.PDFViewerApplication;

	var data = await PDFViewerApplication.pdfDocument.saveDocument(PDFViewerApplication.pdfDocument.annotationStorage);
	const blob = new Blob([data], {
		type: "application/pdf"
	});
	var base64 = await window.Helper.String.blobToBase64(blob);
	await viewModel.getAnnotationStorgae(base64);

	var fileResourceToUpdate = ko.utils.arrayFirst(viewModel.fileResources(), function (data) {
		return data.language == viewModel.languageBeforeChange();
	});
	fileResourceToUpdate.fileResourceContent = base64;

	await Promise.all(viewModel.fileResources().map(async (data) => {
		if (data.language !== viewModel.languageBeforeChange()) {
			var newFileResourceContent = await viewModel.setAnnotationStorage(data.fileResourceContent);
			data.fileResourceContent = newFileResourceContent;
		}
	}));

	var base64data = ko.utils.arrayFirst(viewModel.fileResources(), function (data) {
		return data.language == viewModel.selectedLanguage();
	});

	var newPdfBlob = await window.Helper.String.base64toBlob(base64data.fileResourceContent);
	var objectUrl = window.URL.createObjectURL(newPdfBlob);
	PDFViewerApplication.open(objectUrl);

	viewModel.languageBeforeChange(viewModel.selectedLanguage());
	viewModel.annotations.removeAll();
};


/**
 * saves Signature and renders it into the PDF, which is then displayed in the PDFViewer
 */
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.saveSignature = async function (data, event) {
	var viewModel = this;

	var PDFViewerApplication = document.getElementsByTagName("iframe")[0].contentWindow.PDFViewerApplication;

	var data = await PDFViewerApplication.pdfDocument.saveDocument(PDFViewerApplication.pdfDocument.annotationStorage);

	const blob = new Blob([data], {
		type: "application/pdf"
	});
	var base64data = await window.Helper.String.blobToBase64(blob);
	var signedPdfAsBase64 = await viewModel.fillPdfWithSigning(base64data);

	var fileResourceToUpdate = ko.utils.arrayFirst(viewModel.fileResources(), function (data) {
		return data.language == viewModel.selectedLanguage();
	});
	fileResourceToUpdate.fileResourceContent = signedPdfAsBase64;

	await Promise.all(viewModel.fileResources().map(async (data) => {
		if (data.language !== viewModel.languageBeforeChange()) {
			var newFileResourceContent = await viewModel.fillPdfWithSigning(data.fileResourceContent)
			data.fileResourceContent = newFileResourceContent;
		}
	}));

	var base64data = ko.utils.arrayFirst(viewModel.fileResources(), function (data) {
		return data.language == viewModel.selectedLanguage();
	});

	var newPdfBlob = await window.Helper.String.base64toBlob(base64data.fileResourceContent);
	var objectUrl = window.URL.createObjectURL(newPdfBlob);
	PDFViewerApplication.open(objectUrl);
	viewModel.showSigning(false);
	viewModel.currentSignatureName(null);
	viewModel.clearSignature();
	viewModel.currentPdfwasSigned(true);
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.clearSignature = function () {
	var viewModel = this;
	var api = $('.sigPads').eq(0);
	var pad = api.signaturePad({ drawOnly: true });
	pad.clearCanvas();
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.showSignatureField = function () {
	viewModel.showSigning(true);
	viewModel.currentSignatureName(event.target.name);
};

/**
 * expects Url to an Pdf; renders the current Signature from the curretn Signature Pad into the PDF
 * @param {string} formUrl
 * @returns {string} PDf as a Unit8Array
 */
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.fillPdfWithSigning = async function (formUrl) {
	var viewModel = this;
	var api = $('.sigPads');

	const { PDFDocument } = PDFLib;

	// Load a PDF with form fields
	const pdfDoc = await PDFDocument.load(formUrl);

	const form = pdfDoc.getForm();

	var name = "Placeholder-" + viewModel.currentSignatureName();
	var imagePlaceholder = form.getFieldMaybe(name);

	var pad = api.signaturePad({ drawOnly: true });
	var img = pad.getSignatureImage();

	if (img.startsWith("data:image/png;base64,")) {
		img = img.replace("data:image/png;base64,", "");
	}
	if (imagePlaceholder != undefined) {
		const SigningAsImage = await pdfDoc.embedPng(img);
		imagePlaceholder.setImage(SigningAsImage);
	}

	// Serialize the PDFDocument to bytes (a Uint8Array)
	const pdfBytes = await pdfDoc.saveAsBase64();

	return pdfBytes;
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.checkForSigning = function (formUrl) {
	var viewModel = this;
	var iframe = document.getElementsByTagName("iframe")[0].contentDocument;

	var links = iframe.getElementsByTagName("input");

	for (let i = 0; i < links.length; i++) {
		var name = links[i].name;

		var start = "Unterschrift"
		if (name.toLowerCase().startsWith(start.toLowerCase())) {
			links[i].addEventListener("click", function (event) {
				viewModel.showSigning(true);
				viewModel.currentSignatureName(event.target.name);
			})
		}
	}
	$('.sigPads').signaturePad({ drawOnly: true, lineTop: 110 });
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.hideSigning = function () {
	var viewModel = this;
	viewModel.currentSignatureName(null);
	viewModel.clearSignature();
	viewModel.showSigning(false);
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.getAnnotationStorgae = async function (formUrl) {
	var viewModel = this;

	const { PDFDocument } = PDFLib;
	// Load a PDF with form fields
	const pdfDoc = await PDFDocument.load(formUrl);
	const form = pdfDoc.getForm();
	const fields = form.getFields();

	fields
		.filter(function (field) {
			return !(field.getName().startsWith("untitled") || field.getName() == "" || field.getName() == null || isNaN(field.getName()) && isNaN(parseFloat(field.getName())))
		})
		.forEach(function (field) {
			var fieldName = field.getName();
			var fieldValue = null;
			if (field instanceof PDFLib.PDFTextField) {
				fieldValue = field.getText();
			}
			if (field instanceof PDFLib.PDFCheckBox) {
				fieldValue = field.isChecked();
			}
			if (fieldValue !== null) {
				viewModel.annotations.unshift({
					"name": fieldName,
					"value": fieldValue
				});
			}
		})

	// Serialize the PDFDocument to bytes (a Uint8Array)
	const pdfBytes = await pdfDoc.saveAsBase64();
	return pdfBytes;
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditPdfModalViewModel.prototype.setAnnotationStorage = async function (base64data) {
	var viewModel = this;

	const { PDFDocument } = PDFLib;
	// Load a PDF with form fields
	const dataUri = 'data:application/pdf;base64,' + base64data;
	const pdfDoc = await PDFDocument.load(dataUri);
	const form = pdfDoc.getForm();

	viewModel.annotations().forEach(function (data) {
		var field = form.getFieldMaybe(data.name);
		if (field instanceof PDFLib.PDFTextField) {
			field.setText(data.value);
		}
		if (field instanceof PDFLib.PDFCheckBox) {
			if (data.value) {
				field.check();
			} else {
				field.uncheck();
			}
		}
	})

	// Serialize the PDFDocument to bytes (a Uint8Array)
	const pdfBytes = await pdfDoc.saveAsBase64();
	viewModel.annotations.removeAll();
	return pdfBytes;
};
