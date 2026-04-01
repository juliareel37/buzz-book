"use client";

import { useState } from "react";

type TonightEntry = {
  id: string;
  iconUrl: string;
  drinkName: string;
  detailLine: string;
  abvLine: string;
  bacAdd: string;
};

type TonightListProps = {
  entries: TonightEntry[];
  deleteAction: (formData: FormData) => void;
};

export function TonightList({ entries, deleteAction }: TonightListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const confirmDeleteEntry =
    entries.find((entry) => entry.id === confirmDeleteId) ?? null;

  return (
    <>
      <div className="tonight-list">
        {entries.map((entry) => {
          const menuOpen = openMenuId === entry.id;

          return (
            <article key={entry.id} className="tonight-row-wrap">
              <div className="tonight-row">
                <span className="tonight-icon" aria-hidden="true">
                  <span
                    className="tonight-icon-image"
                    style={
                      {
                        "--icon-url": `url(${entry.iconUrl})`,
                      } as React.CSSProperties
                    }
                  />
                </span>

                <div className="tonight-copy">
                  <p className="tonight-title">{entry.drinkName}</p>
                  <p className="tonight-meta">{entry.detailLine}</p>
                  <p className="tonight-submeta">{entry.abvLine}</p>
                </div>

                <p className="tonight-bac-add">{entry.bacAdd}</p>

                <div className="tonight-menu">
                  <button
                    type="button"
                    className="tonight-more-button"
                    aria-label="More options"
                    aria-expanded={menuOpen}
                    onClick={() => {
                      setConfirmDeleteId(null);
                      setOpenMenuId((current) => (current === entry.id ? null : entry.id));
                    }}
                  >
                    ⋮
                  </button>

                  {menuOpen ? (
                    <div className="tonight-menu-popover">
                      <button
                        type="button"
                        className="tonight-menu-item"
                        onClick={() => {
                          setOpenMenuId(null);
                          setConfirmDeleteId(entry.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {confirmDeleteEntry ? (
        <div
          className="tonight-confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Delete drink"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="tonight-confirm-card"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="tonight-confirm-copy">Delete this drink entry?</p>
            <div className="tonight-confirm-summary">
              <p className="tonight-confirm-detail">{confirmDeleteEntry.drinkName}</p>
              <p className="tonight-confirm-meta">
                {confirmDeleteEntry.detailLine} · {confirmDeleteEntry.abvLine}
              </p>
            </div>
            <p className="tonight-confirm-warning">This can’t be undone.</p>
            <div className="tonight-confirm-actions">
              <button
                type="button"
                className="tonight-confirm-button"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>

              <form action={deleteAction}>
                <input type="hidden" name="drinkEntryId" value={confirmDeleteEntry.id} />
                <button type="submit" className="tonight-delete-button">
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
