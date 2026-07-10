import { subjectColors } from "./subjectData";

export default function SubjectColorPicker({
  selectedColor,
  onChange,
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-gray-700">
        Color
      </label>

      <div className="flex flex-wrap gap-3">
        {subjectColors.map((color) => {
          const selected = selectedColor === color;

          return (
            <button
              key={color}
              type="button"
              disabled={disabled}
              onClick={() => onChange(color)}
              aria-label={`Select ${color}`}
              className={`relative h-10 w-10 rounded-full border-4 transition ${
                selected
                  ? "border-[#0b2d8a] ring-2 ring-[#0b2d8a]/30"
                  : "border-white ring-1 ring-gray-200 hover:scale-105"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
              style={{ backgroundColor: color }}
            />
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
        <span
          className="h-7 w-7 rounded-full"
          style={{ backgroundColor: selectedColor }}
        />

        <span>
          Selected:{" "}
          <strong className="font-medium text-gray-600">{selectedColor}</strong>
        </span>
      </div>
    </div>
  );
}
