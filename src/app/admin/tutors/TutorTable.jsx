import TutorRow from "./TutorRow";

export default function TutorTable({ tutors }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              {[
                "Tutor",
                "Specialties",
                "Availability",
                "Rating",
                "Sessions",
                "Status",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  className="px-8 py-5 text-xs font-bold uppercase tracking-[0.12em] text-gray-500"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tutors.map((tutor, index) => (
              <TutorRow key={`${tutor.email}-${index}`} tutor={tutor} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {tutors.map((tutor, index) => (
          <TutorRow key={`${tutor.email}-${index}`} tutor={tutor} mobile />
        ))}
      </div>
    </>
  );
}
