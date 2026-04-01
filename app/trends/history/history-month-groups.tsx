"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type HistoryDay = {
  dayKey: string;
  dayLabel: string;
  totalOz: string;
  averageAbv: string;
  count: number;
};

type HistoryMonth = {
  monthKey: string;
  monthLabel: string;
  dayCount: number;
  drinkCount: number;
  days: HistoryDay[];
};

type HistoryMonthGroupsProps = {
  months: HistoryMonth[];
};

const OPEN_MONTHS_KEY = "buzz-book-history-open-months";
const RESTORE_KEY = "buzz-book-history-restore";
const SCROLL_KEY = "buzz-book-history-scroll";

function getSavedOpenMonths() {
  if (typeof window === "undefined") {
    return [];
  }

  const shouldRestore = window.sessionStorage.getItem(RESTORE_KEY) === "1";

  if (!shouldRestore) {
    return [];
  }

  const savedOpenMonths = window.sessionStorage.getItem(OPEN_MONTHS_KEY);

  if (!savedOpenMonths) {
    return [];
  }

  try {
    const parsed = JSON.parse(savedOpenMonths);

    if (Array.isArray(parsed)) {
      return parsed.filter((value): value is string => typeof value === "string");
    }
  } catch {
    return [];
  }

  return [];
}

export function HistoryMonthGroups({ months }: HistoryMonthGroupsProps) {
  const [shouldRestoreOnMount] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.sessionStorage.getItem(RESTORE_KEY) === "1";
  });
  const [openMonths, setOpenMonths] = useState<string[]>(() => getSavedOpenMonths());

  useEffect(() => {
    if (!shouldRestoreOnMount) {
      window.sessionStorage.removeItem(OPEN_MONTHS_KEY);
      window.sessionStorage.removeItem(SCROLL_KEY);
      setOpenMonths([]);
      return;
    }

    const savedScroll = window.sessionStorage.getItem(SCROLL_KEY);

    if (savedScroll) {
      const scrollY = Number(savedScroll);

      if (!Number.isNaN(scrollY)) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, scrollY);
          });
        });
      }
    }

    window.sessionStorage.removeItem(RESTORE_KEY);
  }, [shouldRestoreOnMount]);

  const openMonthSet = useMemo(() => new Set(openMonths), [openMonths]);

  useEffect(() => {
    window.sessionStorage.setItem(OPEN_MONTHS_KEY, JSON.stringify(openMonths));
  }, [openMonths]);

  function updateOpenMonths(nextMonths: string[]) {
    setOpenMonths(nextMonths);
  }

  function toggleMonth(monthKey: string) {
    if (openMonthSet.has(monthKey)) {
      updateOpenMonths(openMonths.filter((key) => key !== monthKey));
      return;
    }

    updateOpenMonths([...openMonths, monthKey]);
  }

  function saveReturnState() {
    window.sessionStorage.setItem(RESTORE_KEY, "1");
    window.sessionStorage.setItem(OPEN_MONTHS_KEY, JSON.stringify(openMonths));
    window.sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
  }

  return (
    <div className="history-months">
      {months.map((month) => {
        const isOpen = openMonthSet.has(month.monthKey);

        return (
          <section key={month.monthKey} className="history-month">
            <button
              type="button"
              className="history-month-summary"
              aria-expanded={isOpen}
              onClick={() => toggleMonth(month.monthKey)}
            >
              <div className="history-month-heading">
                <p className="history-month-title">{month.monthLabel}</p>
                <p className="history-month-meta">
                  {month.dayCount} {month.dayCount === 1 ? "day" : "days"} logged
                </p>
              </div>
              <p className="history-month-count">
                <span className="activity-digest-count-value">{month.drinkCount}</span>
                <span className="activity-digest-count-unit">
                  {month.drinkCount === 1 ? "drink" : "drinks"}
                </span>
              </p>
              <span className="history-month-toggle" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen ? (
              <div className="activity-digest-list history-month-list">
                {month.days.map((day) => (
                  <Link
                    key={day.dayKey}
                    href={`/trends/${day.dayKey}?from=history`}
                    className="activity-digest-row"
                    onClick={saveReturnState}
                  >
                    <div className="activity-digest-copy">
                      <p className="activity-digest-title">{day.dayLabel}</p>
                      <p className="activity-digest-meta">
                        {day.totalOz} oz total · {day.averageAbv}% avg ABV
                      </p>
                    </div>
                    <p className="activity-digest-count">
                      <span className="activity-digest-count-value">{day.count}</span>
                      <span className="activity-digest-count-unit">
                        {day.count === 1 ? "drink" : "drinks"}
                      </span>
                    </p>
                    <span className="activity-digest-caret" aria-hidden="true">
                      ›
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
