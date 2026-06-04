"use client";

type Activity = {
  title: string;
  description: string;
};

export default function RecentActivities({
  activities,
}: {
  activities: Activity[];
}) {
  return (
    <div className="rounded-3xl border border-black/[0.06] bg-white p-6">
      <div>
        <p className="text-sm text-[#5F6368]">Recent activity</p>

        <h3 className="mt-1 text-xl font-semibold">Business operations</h3>
      </div>

      <div className="mt-8 space-y-6">
        {activities.map((activity) => (
          <div key={activity.title} className="flex gap-4">
            <div className="mt-2 h-2.5 w-2.5 rounded-full bg-[#4F46E5]" />

            <div>
              <p className="font-medium">{activity.title}</p>

              <p className="mt-1 text-sm leading-6 text-[#5F6368]">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
