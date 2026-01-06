import React from 'react';

const Bibliography: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-orbitron font-bold text-[var(--text-main)] uppercase tracking-widest mb-2">
          Bibliography & Credits
        </h1>
        <p className="text-[var(--text-secondary)] text-sm uppercase tracking-wide">
          Data Sources and Attribution
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-[var(--bg-panel)] border border-[var(--border-ui)] rounded-lg p-6">
          <h2 className="text-xl font-orbitron font-bold text-[var(--text-main)] uppercase tracking-wide mb-4">
            Primary Data Source
          </h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-[var(--text-main)]">Ergast Developer API</h3>
              <p className="text-[var(--text-secondary)] text-sm mb-2">
                The primary source of Formula 1 data including driver standings, constructor standings, and race schedules.
              </p>
              <a
                href="http://ergast.com/mrd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--rbr-red)] hover:text-red-400 text-sm underline"
              >
                http://ergast.com/mrd/
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-main)]">Jolpi.ca API Proxy</h3>
              <p className="text-[var(--text-secondary)] text-sm mb-2">
                CORS-enabled proxy service used to access the Ergast API.
              </p>
              <a
                href="https://api.jolpi.ca/ergast/f1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--rbr-red)] hover:text-red-400 text-sm underline"
              >
                https://api.jolpi.ca/ergast/f1
              </a>
            </div>
          </div>
        </section>

        <section className="bg-[var(--bg-panel)] border border-[var(--border-ui)] rounded-lg p-6">
          <h2 className="text-xl font-orbitron font-bold text-[var(--text-main)] uppercase tracking-wide mb-4">
            Official Formula 1 Resources
          </h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-[var(--text-main)]">Formula 1 Official Website</h3>
              <p className="text-[var(--text-secondary)] text-sm mb-2">
                Official source for Formula 1 news, schedules, and regulations.
              </p>
              <a
                href="https://www.formula1.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--rbr-red)] hover:text-red-400 text-sm underline"
              >
                https://www.formula1.com
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-main)]">FIA Formula 1 Technical Regulations</h3>
              <p className="text-[var(--text-secondary)] text-sm mb-2">
                Technical specifications and sporting regulations governing Formula 1.
              </p>
              <a
                href="https://www.fia.com/regulation/category/110"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--rbr-red)] hover:text-red-400 text-sm underline"
              >
                https://www.fia.com/regulation/category/110
              </a>
            </div>
          </div>
        </section>

        <section className="bg-[var(--bg-panel)] border border-[var(--border-ui)] rounded-lg p-6">
          <h2 className="text-xl font-orbitron font-bold text-[var(--text-main)] uppercase tracking-wide mb-4">
            Team & Driver Information
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mb-4">
            Driver and team data is sourced from official team websites and the Ergast API.
            For the most current information, please visit the official team websites:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-[var(--text-main)] mb-2">2023 Constructor Teams</h4>
              <ul className="space-y-1 text-[var(--text-secondary)]">
                <li>• Mercedes-AMG Petronas F1 Team</li>
                <li>• Scuderia Ferrari</li>
                <li>• McLaren Racing</li>
                <li>• Aston Martin Aramco Cognizant F1 Team</li>
                <li>• BWT Alpine F1 Team</li>
                <li>• Scuderia AlphaTauri</li>
                <li>• Alfa Romeo F1 Team ORLEN</li>
                <li>• Haas F1 Team</li>
                <li>• Red Bull Racing</li>
                <li>• Williams Racing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text-main)] mb-2">Data Attribution</h4>
              <p className="text-[var(--text-secondary)] text-xs">
                Driver statistics, team performance data, and race results are provided courtesy of the Ergast API.
                All rights to team names, driver names, and associated imagery belong to their respective owners.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[var(--bg-panel)] border border-[var(--border-ui)] rounded-lg p-6">
          <h2 className="text-xl font-orbitron font-bold text-[var(--text-main)] uppercase tracking-wide mb-4">
            Technical Credits
          </h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-[var(--text-main)]">React & TypeScript</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Built with React 18 and TypeScript for type-safe development.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-main)]">Vite</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Fast build tool and development server.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-main)]">Tailwind CSS</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Utility-first CSS framework for styling.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[var(--bg-panel)] border border-[var(--border-ui)] rounded-lg p-6">
          <h2 className="text-xl font-orbitron font-bold text-[var(--text-main)] uppercase tracking-wide mb-4">
            Disclaimer
          </h2>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            This dashboard is a fan-made project and is not affiliated with Formula 1, the FIA, or any of the teams and drivers featured.
            All data is provided for informational purposes only. For official information, please visit the official Formula 1 website
            and team websites. Driver and team performance data may change throughout the season.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Bibliography;