'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, CircleHelp, Flower2, Heart, Leaf, Menu, Plus, RotateCcw, Sparkles, WandSparkles } from 'lucide-react';

const flowers = [
  { name: '玫瑰', en: 'Rose', tone: 'blush' }, { name: '洋桔梗', en: 'Lisianthus', tone: 'cream' },
  { name: '毛茛', en: 'Ranunculus', tone: 'wine' }, { name: '尤加利', en: 'Eucalyptus', tone: 'sage' },
  { name: '满天星', en: "Baby’s breath", tone: 'cloud' }, { name: '郁金香', en: 'Tulip', tone: 'apricot' },
  { name: '向日葵', en: 'Sunflower', tone: 'sun' }, { name: '银莲花', en: 'Anemone', tone: 'sky' },
  { name: '绣球', en: 'Hydrangea', tone: 'blue' }, { name: '小雏菊', en: 'Daisy', tone: 'butter' },
  { name: '雪柳', en: 'Spiraea', tone: 'twig' }, { name: '洋甘菊', en: 'Chamomile', tone: 'oat' },
];
const wraps = [
  { name: '牛皮纸', material: '自然粗纹', tone: 'kraft', color: '#bd996d' }, { name: '雪梨纸', material: '米白半透明', tone: 'cream-wrap', color: '#e9dfcb' },
  { name: '棉纸', material: '鼠尾草绿细纹', tone: 'sage-wrap', color: '#94a78e' }, { name: '棉纸', material: '酒红磨砂', tone: 'wine-wrap', color: '#783244' },
  { name: '艺术纸', material: '雾蓝颗粒感', tone: 'blue-wrap', color: '#9daeba' }, { name: '拷贝纸', material: '蜜桃轻透', tone: 'peach-wrap', color: '#e5a184' },
];
const looks = [
  { title: '松弛花园', note: '自然、轻盈，像刚从花园里采回来', tag: '最适合新手', wrap: '牛皮纸 × 鼠尾草绿丝带', wrapTone: 'kraft', steps: ['先用尤加利搭出自然的线条感', '玫瑰与洋桔梗错落放入，保持高低差', '最后用两张牛皮纸叠出松弛的扇形边'] },
  { title: '奶油复古', note: '柔和的奶油色，送人很显心意', tag: '今日推荐', wrap: '米白雪梨纸 × 细麻绳', wrapTone: 'cream-wrap', steps: ['洋桔梗做中心，花头朝向不同方向', '用玫瑰填补空隙，毛茛作为深色点缀', '米白雪梨纸包裹，再系一条细麻绳'] },
  { title: '深夜玫瑰', note: '深酒红的浪漫，适合特别的日子', tag: '氛围感', wrap: '酒红包装纸 × 黑色缎带', wrapTone: 'wine-wrap', steps: ['毛茛集中在视觉中心，形成一颗深色心脏', '玫瑰向外打开，尤加利从背后探出', '用酒红色包装纸收紧花束轮廓'] },
];

type Screen = 1 | 2 | 3;

type PreviewPlan = {
  asset: string;
  variant: string;
  imageClass: string;
  focus: string;
};

function getPreviewPlan(selected: number[], selectedWrap: number): PreviewPlan {
  const selectedSet = new Set(selected);
  const wrapAssets = ['kraft', 'white', 'sage', 'wine', 'sage', 'peach'];

  // This is intentionally local and deterministic: every choice changes the
  // plan without needing an API key or sending the user's selections away.
  if (selectedSet.has(5)) {
    return { asset: 'tulip', variant: 'tulip-focus', imageClass: `preview-photo wrap-${wraps[selectedWrap].tone}`, focus: '郁金香主花' };
  }
  if (selectedSet.has(6)) {
    return { asset: 'sunflower', variant: 'sunflower-focus', imageClass: `preview-photo wrap-${wraps[selectedWrap].tone}`, focus: '向日葵主花' };
  }
  if (selectedSet.has(2)) {
    return { asset: wrapAssets[selectedWrap], variant: 'ranunculus-focus', imageClass: `preview-photo wrap-${wraps[selectedWrap].tone}`, focus: '毛茛主花' };
  }
  if (selectedSet.has(8)) {
    return { asset: wrapAssets[selectedWrap], variant: 'hydrangea-focus', imageClass: `preview-photo wrap-${wraps[selectedWrap].tone}`, focus: '绣球主花' };
  }
  return { asset: wrapAssets[selectedWrap], variant: 'balanced-mix', imageClass: `preview-photo wrap-${wraps[selectedWrap].tone}`, focus: '均衡混搭' };
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>(1);
  const [selected, setSelected] = useState([0, 1, 2, 3]);
  const [selectedWrap, setSelectedWrap] = useState(0);
  const [activeLook, setActiveLook] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [occasion, setOccasion] = useState('给自己');
  const [isGenerating, setIsGenerating] = useState(false);
  const look = looks[activeLook];
  const wrap = wraps[selectedWrap];
  const previewPlan = getPreviewPlan(selected, selectedWrap);
  const imageVariant = previewPlan.variant;
  const imageSrc = `/bouquet-preview-${previewPlan.asset}.png`;
  const selectedNames = selected.map((index) => flowers[index].name);
  const previewKey = `${imageSrc}-${selected.join('-')}-${selectedWrap}`;
  const progress = Math.min(100, 46 + selected.length * 4);

  const toggleFlower = (index: number) => setSelected((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  const reset = () => { setSelected([0, 1, 2, 3]); setSelectedWrap(0); setOccasion('给自己'); };
  const generate = () => { setIsGenerating(true); window.setTimeout(() => { setIsGenerating(false); setScreen(3); }, 650); };

  useEffect(() => {
    type ModelContext = { registerTool: (tool: { name: string; title: string; description: string; inputSchema: Record<string, unknown>; annotations?: Record<string, boolean>; execute: (input: unknown) => unknown }) => void };
    const modelContext = (document as unknown as { modelContext?: ModelContext }).modelContext;
    if (!modelContext?.registerTool) return;
    modelContext.registerTool({ name: 'set_flower_materials', title: '设置花材', description: '选择用户手边已有的花材，并更新第二页的花材选择。', inputSchema: { type: 'object', properties: { flowerIndices: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 11 }, minItems: 1, uniqueItems: true } }, required: ['flowerIndices'], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: (input) => { const values = (input as { flowerIndices?: unknown }).flowerIndices; if (!Array.isArray(values) || values.length === 0 || values.some((value) => typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 11)) throw new Error('flowerIndices must contain integers from 0 to 11'); const next = [...new Set(values as number[])]; setSelected(next); setScreen(2); return { selected: next.map((index) => flowers[index].name) }; } });
    modelContext.registerTool({ name: 'select_wrapping_material', title: '选择包装纸', description: '选择包装纸的颜色和材质，并更新第二页的包装选择。', inputSchema: { type: 'object', properties: { wrapIndex: { type: 'integer', minimum: 0, maximum: 5 } }, required: ['wrapIndex'], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: (input) => { const index = (input as { wrapIndex?: unknown }).wrapIndex; if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index > 5) throw new Error('wrapIndex must be between 0 and 5'); setSelectedWrap(index); setScreen(2); return { wrapping: `${wraps[index].name} · ${wraps[index].material}` }; } });
    return undefined;
  }, []);

  if (screen === 1) return <main className="app-shell"><Landing onStart={() => setScreen(2)} /><button className="mobile-menu" aria-label="打开菜单"><Menu size={20} /></button></main>;

  return <main className="app-shell"><FlowHeader screen={screen} onHome={() => setScreen(1)} /><div className="page-wrap flow-page">{screen === 2 ? <SelectionScreen selected={selected} selectedWrap={selectedWrap} occasion={occasion} isGenerating={isGenerating} progress={progress} onToggleFlower={toggleFlower} onSelectWrap={setSelectedWrap} onOccasion={setOccasion} onReset={reset} onBack={() => setScreen(1)} onGenerate={generate} /> : <ResultScreen look={look} wrap={wrap} selectedNames={selectedNames} imageSrc={imageSrc} imageVariant={imageVariant} imageClass={previewPlan.imageClass} focus={previewPlan.focus} previewKey={previewKey} activeLook={activeLook} saved={saved} showTutorial={showTutorial} onLookChange={setActiveLook} onSave={() => setSaved(!saved)} onTutorial={() => setShowTutorial(!showTutorial)} onBack={() => setScreen(2)} />}</div><button className="mobile-menu" aria-label="打开菜单"><Menu size={20} /></button></main>;
}

function Landing({ onStart }: { onStart: () => void }) {
  return <><header className="topbar"><div className="brand"><span className="brand-mark"><Flower2 size={19} strokeWidth={1.8} /></span><span>花束研究所</span></div><div className="top-actions"><button className="icon-btn" aria-label="帮助"><CircleHelp size={18} /></button><button className="profile">L</button></div></header><div className="landing-wrap"><section className="landing-copy"><p className="eyebrow"><Sparkles size={14} /> 一个帮你包花的 app</p><h1>把买回来的花，<br /><em>变成一束好看的花。</em></h1><p className="landing-lead">不知道怎么搭配花材，也不会包花？<br />花束研究所会根据你手里的花，给你几种好看的包装灵感，<br />再一步一步陪你把它完成。</p><button className="primary-cta" onClick={onStart}>开始设计我的花束 <ArrowRight size={18} /></button><div className="landing-features"><div><span>01</span><b>选花材</b><small>告诉我们你买了什么花</small></div><div><span>02</span><b>选包装</b><small>挑喜欢的颜色和质感</small></div><div><span>03</span><b>看教程</b><small>跟着步骤把花包起来</small></div></div></section><section className="landing-visual"><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><img src="/bouquet-preview-white.png" alt="白色纹理纸和浅粉蝴蝶兰花束" /><div className="visual-note"><span>YOUR FLOWERS</span><b>从手里的花开始</b></div></section></div><footer className="landing-footer"><span>每一束花，都是独一无二的练习。</span><span>Made for flower people <Flower2 size={14} /></span></footer></>;
}

function FlowHeader({ screen, onHome }: { screen: Screen; onHome: () => void }) {
  return <header className="topbar"><button className="brand brand-button" onClick={onHome}><span className="brand-mark"><Flower2 size={19} strokeWidth={1.8} /></span><span>花束研究所</span></button><div className="flow-steps"><span className={screen >= 1 ? 'done' : ''}>01 介绍</span><i /><span className={screen >= 2 ? 'current' : ''}>02 选择</span><i /><span className={screen >= 3 ? 'current' : ''}>03 生成</span></div><div className="top-actions"><button className="icon-btn" aria-label="帮助"><CircleHelp size={18} /></button><button className="profile">L</button></div></header>;
}

function SelectionScreen({ selected, selectedWrap, occasion, isGenerating, progress, onToggleFlower, onSelectWrap, onOccasion, onReset, onBack, onGenerate }: { selected: number[]; selectedWrap: number; occasion: string; isGenerating: boolean; progress: number; onToggleFlower: (index: number) => void; onSelectWrap: (index: number) => void; onOccasion: (value: string) => void; onReset: () => void; onBack: () => void; onGenerate: () => void }) {
  return <section className="selection-screen"><div className="flow-heading"><div><p className="eyebrow">02 / 选择你的材料</p><h2>先告诉我，你手里有什么。</h2><p>花材和包装纸都可以多选或随时更换。</p></div><div className="progress-card"><span>准备完成度</span><strong>{progress}%</strong><div className="progress"><i style={{ width: `${progress}%` }} /></div><small>{selected.length} 种花材 · 还差一步</small></div></div><div className="selection-grid"><section className="panel selection-panel"><div className="panel-heading"><div><span className="step-no">01</span><h2>我买了这些花</h2></div><button className="reset" onClick={onReset}><RotateCcw size={14} /> 重置</button></div><p className="helper">点选你手边的花材，可以多选。</p><div className="flower-grid">{flowers.map((flower, i) => <button className={`flower-chip ${selected.includes(i) ? 'chosen' : ''}`} key={flower.name} onClick={() => onToggleFlower(i)}><span className={`flower-dot ${flower.tone}`}><span /></span><span className="flower-name"><b>{flower.name}</b><small>{flower.en}</small></span>{selected.includes(i) ? <Check className="check" size={15} /> : <Plus className="plus" size={15} />}</button>)}</div></section><section className="panel selection-panel"><div className="panel-heading"><div><span className="step-no">02</span><h2>我想用这张包装纸</h2></div><span className="choice-count">{wraps.length} 种选择</span></div><p className="helper">选择颜色和材质，生成时会应用到花束上。</p><div className="wrap-grid wrap-grid-large">{wraps.map((item, i) => <button className={`wrap-option ${selectedWrap === i ? 'chosen' : ''}`} key={`${item.name}-${item.material}`} onClick={() => onSelectWrap(i)}><span className={`wrap-swatch ${item.tone}`} /><span><b>{item.name}</b><small>{item.material}</small></span>{selectedWrap === i && <Check size={14} />}</button>)}</div><div className="occasion occasion-large"><label>这束花是送给谁？</label><div className="occasion-select"><select value={occasion} onChange={(event) => onOccasion(event.target.value)} aria-label="选择送花对象"><option>给自己</option><option>给朋友</option><option>给恋人</option><option>给家人</option></select><ChevronDown size={15} /></div></div><div className="selection-summary"><div className={`summary-swatch ${wraps[selectedWrap].tone}`} /><div><small>当前包装选择</small><b>{wraps[selectedWrap].name} · {wraps[selectedWrap].material}</b></div></div></section></div><div className="flow-actions"><button className="back-action" onClick={onBack}><ArrowLeft size={16} /> 返回介绍</button><button className="generate wide-generate" onClick={onGenerate} disabled={isGenerating || selected.length === 0}>{isGenerating ? <><Sparkles size={17} /> 正在生成你的花束…</> : <><WandSparkles size={17} /> 生成我的花束 <ArrowRight size={17} /></>}</button></div></section>;
}

function ResultScreen({ look, wrap, selectedNames, imageSrc, imageVariant, imageClass, focus, previewKey, activeLook, saved, showTutorial, onLookChange, onSave, onTutorial, onBack }: { look: typeof looks[number]; wrap: typeof wraps[number]; selectedNames: string[]; imageSrc: string; imageVariant: string; imageClass: string; focus: string; previewKey: string; activeLook: number; saved: boolean; showTutorial: boolean; onLookChange: (index: number) => void; onSave: () => void; onTutorial: () => void; onBack: () => void }) {
  return <section className="result-screen"><div className="result-heading"><div><p className="eyebrow"><Sparkles size={14} /> 03 / 你的花束生成好了</p><h2>这就是你的<br /><em>{look.title}。</em></h2><p>这是根据你刚才的花材和包装，自动匹配出的免费本地参考方案。</p></div><button className="back-edit" onClick={onBack}><ArrowLeft size={15} /> 重新选择</button></div><div className="result-grid"><section className="preview panel"><div className="panel-heading"><div><span className="step-no">FREE LOCAL PREVIEW</span><h2>你的花束效果</h2></div><button className={`save-btn ${saved ? 'saved' : ''}`} onClick={onSave}><Heart size={15} fill={saved ? 'currentColor' : 'none'} /> {saved ? '已收藏' : '收藏'}</button></div><div className="look-tabs">{looks.map((item, i) => <button className={activeLook === i ? 'active' : ''} onClick={() => onLookChange(i)} key={item.title}><span className="tab-index">0{i + 1}</span>{item.title}</button>)}</div><div className="hero-image"><img className={imageClass} key={previewKey} src={imageSrc} alt={`${look.title}风格，${selectedNames.join('、')}和${wrap.name}${wrap.material}包装的本地花束预览`} /><div className="image-label"><span>FREE PREVIEW · {imageVariant.toUpperCase()}</span><b>{look.title}</b></div><button className="image-heart" onClick={onSave} aria-label="收藏方案"><Heart size={18} fill={saved ? 'currentColor' : 'none'} /></button></div><div className="look-caption"><div><h3>{look.title}</h3><p>{look.note}</p><div className="wrap-note"><span className={`wrap-dot ${wrap.tone}`} style={{ backgroundColor: wrap.color }} /> 当前包装：{wrap.name} · {wrap.material}</div><div className="material-summary"><span>已选花材</span><div>{selectedNames.map((name) => <b key={name}>{name}</b>)}</div></div><p className="local-note">本地匹配：{focus} · 完全免费，不上传你的选择</p></div><span className="recommend">{look.tag}</span></div></section><aside className="tutorial panel"><div className="panel-heading"><div><span className="step-no">HOW TO</span><h2>跟着教程包起来</h2></div><BookOpen size={18} className="muted-icon" /></div><p className="helper">3 个小步骤，把这束花还原出来。</p><div className="steps">{look.steps.map((step, i) => <div className="tutorial-step" key={step}><span>{i + 1}</span><p>{step}</p></div>)}</div><button className="tutorial-link" onClick={onTutorial}>{showTutorial ? '收起详细教程' : '查看详细教程'} <ArrowRight size={16} /></button>{showTutorial && <div className="detail-tip"><Leaf size={15} /> 小提醒：花茎交叉点要握紧，包装纸才会自然打开。</div>}<div className="tip-card"><Leaf size={17} /><div><b>花艺小贴士</b><p>包装纸的高度不要超过花头的 ⅔，才能露出轻盈的层次。</p></div></div></aside></div></section>;
}
