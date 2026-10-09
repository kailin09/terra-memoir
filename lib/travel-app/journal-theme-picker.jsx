const themes = [
  { id: 'linen', label: '亚麻手账', colors: ['#f8f4e9', '#77846f', '#ad8c6d'] },
  { id: 'coast', label: '海岸邮笺', colors: ['#edf5f2', '#537d83', '#d29270'] },
  { id: 'garden', label: '植物标本', colors: ['#f0f2e8', '#687d63', '#a4775c'] },
  { id: 'sunset', label: '夕照旅笺', colors: ['#fff0e7', '#b96558', '#d59a52'] },
];

const exportPalettes = {
  linen: { page: '#f2efe6', paper: '#fbf9f2', ink: '#51483d', muted: '#827866', accent: '#71806a', soft: '#eff0e6', line: '#d8d0c0' },
  coast: { page: '#e8f1ef', paper: '#f5faf8', ink: '#35525a', muted: '#668187', accent: '#4d7a81', soft: '#e1eeeb', line: '#bed4d1' },
  garden: { page: '#e9eddf', paper: '#f5f6ed', ink: '#465744', muted: '#79836b', accent: '#647b5e', soft: '#e5eadc', line: '#cbd3bd' },
  sunset: { page: '#f7e8dc', paper: '#fff7ef', ink: '#65483f', muted: '#9b7260', accent: '#b66358', soft: '#f9e4d9', line: '#e6c7b4' },
};

export function JournalThemePicker({ selectedTheme, onSelect }) {
  return (
    <section className="journal-theme-picker" aria-label="手账主题">
      <div className="journal-theme-heading">
        <strong>选择手账主题</strong>
        <small>仅应用于这趟旅程，可随时切换</small>
      </div>
      <div className="journal-theme-options" role="group" aria-label="手账配色">
        {themes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className={`journal-theme-option${selectedTheme === theme.id ? ' selected' : ''}`}
            aria-pressed={selectedTheme === theme.id}
            onClick={() => onSelect(theme.id)}
          >
            <span className="journal-theme-swatches" aria-hidden="true">
              {theme.colors.map((color) => (
                <i key={color} style={{ backgroundColor: color }} />
              ))}
            </span>
            <span>{theme.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function themeJournalHtml(html, themeId) {
  const theme = exportPalettes[themeId] || exportPalettes.linen;
  const css = 'body{background:' + theme.page + ';color:' + theme.ink + '}' +
    '.book{background:' + theme.paper + ';border-color:' + theme.line + '}' +
    '.cover{border-color:' + theme.line + '}' +
    '.cover h1,.entry h2,section h2{color:' + theme.ink + '}' +
    '.eyebrow,.cover p,.meta,footer{color:' + theme.muted + '}' +
    '.stamps{color:' + theme.accent + '}' +
    '.note{border-color:' + theme.accent + ';background:' + theme.soft + ';color:' + theme.ink + '}' +
    'section{border-color:' + theme.line + ';background:' + theme.soft + '}';
  const layouts = {
    coast: '.book{border-radius:22px;overflow:hidden}.cover{padding:40px 22px 34px;background:linear-gradient(145deg,#dceeea,#eff7f4 58%,#f7eee2);border:0}.entry{margin:24px 0;padding:24px 20px;border:1px solid #c5dbd7;border-radius:16px;background:#fbfdfb;box-shadow:0 7px 18px #4d7a8116}.entry img{border-radius:10px}.note{border-left:3px solid #4d7a81;border-radius:0 10px 10px 0;text-align:left}',
    garden: '.book{background-image:radial-gradient(#82947620 1px,transparent 1px);background-size:16px 16px}.cover{padding:38px 24px;background:linear-gradient(120deg,#edf0e4,#f8f7ed 70%);border-bottom:4px double #91a184}.entry{margin:18px 0;padding:23px 22px;border:0;border-left:5px solid #829476;background:#f8f8f0;box-shadow:0 4px 12px #53614b12}.entry:nth-of-type(even){border-left-color:#b28368;background:#f7f1e8}.stamps{display:inline-block;padding:4px 10px;border-radius:18px;background:#e8eddf}',
    sunset: '.book{border:2px solid #e3bca7;border-radius:24px;background:linear-gradient(150deg,#fff7ef,#f9e7dc)}.cover{padding:40px 28px;border:0;border-radius:18px;background:radial-gradient(circle at 85% 20%,#edbd8d 0 8%,transparent 8.5%),linear-gradient(135deg,#f8d9c9,#fff0e4 62%,#f4d8b9)}.entry{margin:20px 0;padding:24px 20px;border:1px solid #e7c5b2;border-radius:22px 8px;background:#fff9f4;box-shadow:0 5px 14px #a85f4c12}.entry:nth-of-type(even){border-radius:8px 22px;background:#fae9df}.note{border:0;border-radius:14px;background:#fae7dc;text-align:center}',
  };
  return html.replace('</style>', css + (layouts[themeId] || '') + '</style>');
}
