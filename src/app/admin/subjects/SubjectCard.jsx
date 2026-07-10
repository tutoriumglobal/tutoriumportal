import { FiBookOpen, FiEdit2, FiTrash2 } from "react-icons/fi";
import SubjectStatusBadge from "./SubjectStatusBadge";

function hexToRgba(hex, opacity) {
  const safeHex =
    typeof hex === "string" && /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#0B2D8A";

  const normalized = safeHex.replace("#", "");

  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

export default function SubjectCard({ subject, onEdit, onDelete }) {
  const color = subject.color || "#0B2D8A";

  return (
    <article className="group flex min-h-[116px] items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 transition hover:border-gray-200 hover:shadow-sm">
      <div className="flex min-w-0 items-center gap-5">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
          style={{
            color,
            backgroundColor: hexToRgba(color, 0.1),
          }}
        >
          <FiBookOpen className="text-2xl" />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-gray-950">
            {subject.name}
          </h3>

          {subject.category && (
            <p className="mt-1 truncate text-xs text-gray-400">
              {subject.category}
            </p>
          )}

          <div className="mt-2">
            <SubjectStatusBadge
              status={subject.status || "active"}
              color={color}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${subject.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-[#0b2d8a]"
        >
          <FiEdit2 />
        </button>

        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${subject.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <FiTrash2 />
        </button>
      </div>
    </article>
  );
}
