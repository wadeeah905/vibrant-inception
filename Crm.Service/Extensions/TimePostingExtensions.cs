namespace Crm.Service.Extensions
{
	using Crm.Service.Model;

	public static class TimePostingExtensions
	{
		public static bool IsPrePlanned(this ServiceOrderTimePosting entity)
		{
			if (entity.PlannedDurationInMinutes is not null
				&& entity.DurationInMinutes is null
				&& entity.UserUsername is null
				&& entity.UserId is null)
			{
				return true;
			}
			return false;
		}
	}
}
