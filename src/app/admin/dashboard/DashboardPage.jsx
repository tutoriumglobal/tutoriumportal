"use client";

import { useCallback, useEffect, useState } from "react";

import { FiBookOpen, FiRefreshCw, FiUsers } from "react-icons/fi";

import { PiStudent } from "react-icons/pi";
import { toast } from "sonner";

import DashboardSkeleton from "./DashboardSkeleton";
import ErrorState from "../../ui/ErrorState";

import { getDashboardStats } from "../../../../services/dashboard.service";

const emptyStats = {
  students: {
    active: 0,
    total: 0,
    recent: 0,
  },

  tutors: {
    active: 0,
    total: 0,
    recent: 0,
  },

  assignments: {
    active: 0,
    total: 0,
    recent: 0,
  },

  subjects: {
    active: 0,
    total: 0,
    recent: 0,
  },
};

export default function DashboardPage() {
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageError, setPageError] = useState("");

  const loadDashboard = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setPageError("");

    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Unable to load dashboard:", error);

      const message = error?.message || "Unable to load dashboard information.";

      setPageError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div>
        <DashboardHeader />
        <DashboardSkeleton />
      </div>
    );
  }

  if (pageError) {
    return (
      <div>
        <DashboardHeader />

        <ErrorState
          title="Unable to load dashboard"
          message={pageError}
          onRetry={() => loadDashboard()}
        />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        refreshing={refreshing}
        onRefresh={() => loadDashboard(false)}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardStatCard
          title="Active Students"
          value={stats.students.active}
          recentText={`+${stats.students.recent} this month`}
          footerText={`${stats.students.active} of ${stats.students.total} total`}
          current={stats.students.active}
          total={stats.students.total}
          icon={<FiUsers />}
          iconClassName="bg-blue-50 text-[#0b2d8a]"
          barClassName="bg-[#0b2d8a]"
        />

        <DashboardStatCard
          title="Active Tutors"
          value={stats.tutors.active}
          recentText={`+${stats.tutors.recent} this month`}
          footerText={`${stats.tutors.active} of ${stats.tutors.total} total`}
          current={stats.tutors.active}
          total={stats.tutors.total}
          icon={<PiStudent />}
          iconClassName="bg-emerald-50 text-emerald-600"
          barClassName="bg-emerald-600"
        />

        <DashboardStatCard
          title="Assignments"
          value={stats.assignments.total}
          recentText={`+${stats.assignments.recent} this week`}
          footerText={`${stats.assignments.active} of ${stats.assignments.total} active`}
          current={stats.assignments.active}
          total={stats.assignments.total}
          icon={<FiBookOpen />}
          iconClassName="bg-purple-50 text-purple-600"
          barClassName="bg-purple-600"
        />

        <DashboardStatCard
          title="Subjects"
          value={stats.subjects.active}
          recentText={`+${stats.subjects.recent} this month`}
          footerText={`${stats.subjects.active} of ${stats.subjects.total} total`}
          current={stats.subjects.active}
          total={stats.subjects.total}
          icon={<FiBookOpen />}
          iconClassName="bg-amber-50 text-amber-500"
          barClassName="bg-amber-500"
        />
      </div>
    </div>
  );
}

function DashboardHeader({ refreshing = false, onRefresh }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Overview of students, tutors, assignments and subjects.
        </p>
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-600 transition hover:border-[#0b2d8a] hover:text-[#0b2d8a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      )}
    </div>
  );
}

function DashboardStatCard({
  title,
  value,
  recentText,
  footerText,
  current,
  total,
  icon,
  iconClassName,
  barClassName,
}) {
  const progress = calculatePercentage(current, total);

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-gray-500 sm:text-base">
            {title}
          </p>

          <p className="mt-5 text-4xl font-bold text-gray-950 sm:text-5xl">
            {value}
          </p>

          <p className="mt-4 text-base text-gray-400 sm:text-lg">
            {recentText}
          </p>
        </div>

        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl sm:h-20 sm:w-20 sm:text-3xl ${iconClassName}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-10">
        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barClassName}`}
            style={{
              width: `${progress}%`,
            }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${title} progress`}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-base text-gray-400">{footerText}</p>

          <p className="text-sm font-semibold text-gray-500">{progress}%</p>
        </div>
      </div>
    </article>
  );
}

function calculatePercentage(current, total) {
  if (!total || total <= 0) {
    return 0;
  }

  const percentage = Math.round((Number(current) / Number(total)) * 100);

  return Math.min(Math.max(percentage, 0), 100);
}
