const settingNotes = [
  "Catalogue controls are available through Gemstones, Collections, and Jewellery.",
  "Client records are available through Enquiries, Appointments, and Newsletter.",
  "Core settings are being prepared for future operational preferences and integration checks.",
];

export default function AdminSettingsPage() {
  return (
    <section className="max-w-3xl">
      <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">Protected Admin</p>
      <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.35rem)] font-normal leading-tight">Settings</h1>
      <p className="mt-5 text-sm leading-7 text-charcoal/64">
        Core settings are being prepared. Current operational controls are available through the
        catalogue and inbox sections.
      </p>
      <div className="mt-10 border border-charcoal/10 bg-porcelain/74 p-6 shadow-[0_18px_50px_rgb(23_20_17_/_0.035)]">
        <p className="text-[0.62rem] uppercase tracking-[0.22em] text-charcoal/45">Current Controls</p>
        <ul className="mt-5 space-y-3 text-sm leading-7 text-charcoal/64">
          {settingNotes.map((note) => (
            <li className="border-t border-charcoal/10 pt-3 first:border-t-0 first:pt-0" key={note}>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
