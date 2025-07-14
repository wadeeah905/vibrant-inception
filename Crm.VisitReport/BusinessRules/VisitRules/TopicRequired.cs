namespace Crm.VisitReport.BusinessRules.VisitRules
{
	using Crm.Library.Validation.BaseRules;
	using Crm.VisitReport.Model;

	public class TopicRequired : RequiredRule<VisitTopic>
	{
		public TopicRequired()
		{
			Init(x => x.Topic);
		}
	}
}