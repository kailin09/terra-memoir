'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronDown, CircleHelp, Flower2, Heart, Leaf, Menu, Plus, RotateCcw, Sparkles, WandSparkles } from 'lucide-react';

const flowers = [
  { name: '玫瑰', en: 'Rose', tone: 'blush' }, { name: '洋桔梗', en: 'Lisianthus', tone: 'cream' },
  { name: '毛茛', en: 'Ranunculus', tone: 'wine' }, { name: '尤加利', en: 'Eucalyptus', tone: 'sage' },
  { name: '满天星', en: "Baby’s breath", tone: 'cloud' }, { name: '郁金香', en: 'Tulip', tone: 'apricot' },
  { name: '向日葵', en: 'Sunflower', tone: 'sun' }, { name: '银莲花', en: 'Anemone', tone: 'sky' },
  { name: '绣球', en: 'Hydrangea', tone: 'blue' }, { name: '小雏菊', en: 'Daisy', tone: 'butter' },
  { name: '雪柳', en: 'Spiraea', tone: 'twig' }, { name: '洋甘菊', en: 'Chamomile', tone: 'oat' },
];
const wraps = [
  { name: '牛皮纸', material: '自然粗纹', tone: 'kraft', color: '#bd996d' },
  { name: '雪梨纸', material: '米白半透明', tone: 'cream-wrap', color: '#e9dfcb' },
  { name: '棉纸', material: '鼠尾草绿细纹', tone: 'sage-wrap', color: '#94a78e' },
  { name: '棉纸', material: '酒红磨砂', tone: 'wine-wrap', color: '#783244' },
  { name: '艺术纸', material: '雾蓝颗粒感', tone: 'blue-wrap', color: '#9daeba' },
  { name: '拷贝纸', material: '蜜桃轻透', tone: 'peach-wrap', color: '#e5a184' },
];
const looks = [
  { title: '松弛花园', note: '自然、轻盈，像刚从花园里采回来', tag: '最适合新手', wrap: '牛皮纸 × 鼠尾草绿丝带', wrapTone: 'kraft', steps: ['先用尤加利搭出自然的线条感', '玫瑰与洋桔梗错落放入，保持高低差', '最后用两张牛皮纸叠出松弛的扇形边'] },
  { title: '奶油复古', note: '柔和的奶油色，送人很显心意', tag: '今日推荐', wrap: '米白雪梨纸 × 细麻绳', wrapTone: 'cream-wrap', steps: ['洋桔梗做中心，花头朝向不同方向', '用玫瑰填补空隙，毛茛作为深色点缀', '米白雪梨纸包裹，再系一条细麻绳'] },
  { title: '深夜玫瑰', note: '深酒红的浪漫，适合特别的日子', tag: '氛围感', wrap: '酒红包装纸 × 黑色缎带', wrapTone: 'wine-wrap', steps: ['毛茛集中在视觉中心，形成一颗深色心脏', '玫瑰向外打开，尤加利从背后探出', '用酒红色包装纸收紧花束轮廓'] },
];

export default function Home() {
  const [selected, setSelected] = useState([0, 1, 2, 3]);
  const [activeLook, setActiveLook] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [occasion, setOccasion] = useState('给自己');
  const [selectedWrap, setSelectedWrap] = useState(0);
  const look = looks[activeLook];
  const wrap = wraps[selectedWrap];
  const wrapVariants = ['kraft', 'white', 'sage', 'wine', 'sage', 'peach'];
  const imageVariant = wrapVariants[selectedWrap];
  const flowerTone = selected.some((index) => [6, 9, 11].includes(index)) ? 'bright' : selected.some((index) => [0, 2].includes(index)) ? 'romantic' : 'soft';
  const imageSrc = `/bouquet-preview-${imageVariant}.png`;
  const toggleFlower = (i: number) => setSelected((current) => current.includes(i) ? current.filter((x) => x !== i) : [...current, i]);
  const progress = Math.min(100, 46 + selected.length * 8);

  useEffect(() => {
    type ModelContext = { registerTool: (tool: { name: string; title: string; description: string; inputSchema: Record<string, unknown>; annotations?: Record<string, boolean>; execute: (input: unknown) => unknown }) => void };
    const modelContext = (document as unknown as { modelContext?: ModelContext }).modelContext;
    if (!modelContext?.registerTool) return;
    modelContext.registerTool({ name: 'set_flower_materials', title: '设置花材', description: '选择用户手边已有的花材，并更新花束工作台。', inputSchema: { type: 'object', properties: { flowerIndices: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 11 }, minItems: 1, uniqueItems: true } }, required: ['flowerIndices'], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: (input) => { const values = (input as { flowerIndices?: unknown }).flowerIndices; if (!Array.isArray(values) || values.length === 0 || values.some((value) => typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 11)) throw new Error('flowerIndices must contain integers from 0 to 11'); const next = [...new Set(values as number[])]; setSelected(next); return { selected: next.map((index) => flowers[index].name) }; } });
    modelContext.registerTool({ name: 'select_bouquet_style', title: '选择包装风格', description: '切换当前花束的包装风格，并同步教程内容。', inputSchema: { type: 'object', properties: { styleIndex: { type: 'integer', minimum: 0, maximum: 2 } }, required: ['styleIndex'], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: (input) => { const index = (input as { styleIndex?: unknown }).styleIndex; if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index > 2) throw new Error('styleIndex must be 0, 1, or 2'); setActiveLook(index); return { style: looks[index].title, tutorial: looks[index].steps }; } });
    modelContext.registerTool({ name: 'select_wrapping_material', title: '选择包装纸', description: '选择包装纸的颜色和材质，并更新工作台当前包装。', inputSchema: { type: 'object', properties: { wrapIndex: { type: 'integer', minimum: 0, maximum: 5 } }, required: ['wrapIndex'], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: (input) => { const index = (input as { wrapIndex?: unknown }).wrapIndex; if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index > 5) throw new Error('wrapIndex must be between 0 and 5'); setSelectedWrap(index); return { wrapping: `${wraps[index].name} · ${wraps[index].material}` }; } });
    return undefined;
  }, []);

  return <main className="app-shell">
    <header className="topbar"><div className="brand"><span className="brand-mark"><Flower2 size={19} strokeWidth={1.8} /></span><span>花束研究所</span></div><nav><button className="nav-active">我的花束</button><button onClick={() => setSaved(true)}>灵感簿</button><button onClick={() => setShowTutorial(true)}>包花课堂</button></nav><div className="top-actions"><button className="icon-btn" aria-label="帮助"><CircleHelp size={18} /></button><button className="profile">L</button></div></header>
    <div className="page-wrap">
      <section className="intro-row"><div><p className="eyebrow"><Sparkles size={14} /> 今日花艺工作台</p><h1>把手里的花，包成<br /><em>你会喜欢的样子。</em></h1><p className="intro-copy">选好你买到的花材，剩下的交给我们。<br />先从一束松弛的花园感开始吧。</p></div><div className="progress-card"><span>花束完成度</span><strong>{progress}%</strong><div className="progress"><i style={{ width: `${progress}%` }} /></div><small>{selected.length} 种花材 · 预计 15 分钟</small></div></section>
      <div className="workspace">
        <aside className="materials panel"><div className="panel-heading"><div><span className="step-no">01</span><h2>我买了这些花</h2></div><button className="reset" onClick={() => { setSelected([0,1,2,3]); setOccasion('给自己'); setSelectedWrap(0); }}><RotateCcw size={14} /> 重置</button></div><p className="helper">点选你手边的花材，可以多选。</p><div className="flower-grid">{flowers.map((flower, i) => <button className={`flower-chip ${selected.includes(i) ? 'chosen' : ''}`} key={flower.name} onClick={() => toggleFlower(i)}><span className={`flower-dot ${flower.tone}`}><span /></span><span className="flower-name"><b>{flower.name}</b><small>{flower.en}</small></span>{selected.includes(i) ? <Check className="check" size={15} /> : <Plus className="plus" size={15} />}</button>)}</div><div className="occasion"><label>这束花是送给谁？</label><div className="occasion-select"><select value={occasion} onChange={(event) => setOccasion(event.target.value)} aria-label="选择送花对象"><option>给自己</option><option>给朋友</option><option>给恋人</option><option>给家人</option></select><ChevronDown size={15} /></div></div><div className="wrap-picker"><div className="subheading"><label>选一张包装纸</label><span>{wrap.name} · {wrap.material}</span></div><div className="wrap-grid">{wraps.map((item, i) => <button className={`wrap-option ${selectedWrap === i ? 'chosen' : ''}`} key={`${item.name}-${item.material}`} onClick={() => setSelectedWrap(i)}><span className={`wrap-swatch ${item.tone}`} /><span><b>{item.name}</b><small>{item.material}</small></span>{selectedWrap === i && <Check size={14} />}</button>)}</div></div><button className="generate" onClick={() => setActiveLook((activeLook + 1) % looks.length)}><WandSparkles size={17} /> 生成我的包装方案 <ArrowRight size={17} /></button></aside>
        <section className="preview panel"><div className="panel-heading"><div><span className="step-no">02</span><h2>试试看这几种</h2></div><button className={`save-btn ${saved ? 'saved' : ''}`} onClick={() => setSaved(!saved)}><Heart size={15} fill={saved ? 'currentColor' : 'none'} /> {saved ? '已收藏' : '收藏'}</button></div><div className="look-tabs">{looks.map((item, i) => <button className={activeLook === i ? 'active' : ''} onClick={() => setActiveLook(i)} key={item.title}><span className="tab-index">0{i + 1}</span>{item.title}</button>)}</div><div className={`hero-image image-style-${activeLook} flower-tone-${flowerTone}`}><img key={imageSrc} src={imageSrc} alt={`${look.title}风格，${wrap.name}${wrap.material}包装的 AI 花束预览`} /><div className="image-label"><span>AI PREVIEW · {imageVariant.toUpperCase()}</span><b>{look.title}</b></div><button className="image-heart" onClick={() => setSaved(!saved)} aria-label="收藏方案"><Heart size={18} fill={saved ? 'currentColor' : 'none'} /></button></div><div className="look-caption"><div><h3>{look.title}</h3><p>{look.note}</p><div className="wrap-note"><span className={`wrap-dot ${wrap.tone}`} style={{ backgroundColor: wrap.color }} /> 当前包装：{wrap.name} · {wrap.material}</div></div><span className="recommend">{look.tag}</span></div></section>
        <aside className="tutorial panel"><div className="panel-heading"><div><span className="step-no">03</span><h2>包起来，很简单</h2></div><BookOpen size={18} className="muted-icon" /></div><p className="helper">跟着 3 个小步骤，就能还原这束花。</p><div className="steps">{look.steps.map((step, i) => <div className="tutorial-step" key={step}><span>{i + 1}</span><p>{step}</p></div>)}</div><button className="tutorial-link" onClick={() => setShowTutorial(!showTutorial)}>{showTutorial ? '收起详细教程' : '查看详细教程'} <ArrowRight size={16} /></button>{showTutorial && <div className="detail-tip"><Leaf size={15} /> 小提醒：花茎交叉点要握紧，包装纸才会自然打开。</div>}<div className="tip-card"><Leaf size={17} /><div><b>花艺小贴士</b><p>包装纸的高度不要超过花头的 ⅔，才能露出轻盈的层次。</p></div></div></aside>
      </div><footer><span>每一束花，都是独一无二的练习。</span><span>Made for flower people <Flower2 size={14} /></span></footer>
    </div><button className="mobile-menu" aria-label="打开菜单"><Menu size={20} /></button>
  </main>;
}
