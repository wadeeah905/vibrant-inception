namespace Crm.Service.ViewModels
{
	using Crm.Library.AutoFac;

	public interface IServiceOrderReportViewModel : ITransientDependency
	{
		double HeaderContentSize { get; }
		double HeaderContentSpacing { get; }
		double FooterContentSize { get; }
		double FooterContentSpacing { get; }
	}
}