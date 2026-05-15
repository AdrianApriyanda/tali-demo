import { useState } from "react";

// ── THEME & DATA ──────────────────────────────────────────────────────────────
const C = {
  bg: "#fdfaf6", card: "#fff", border: "#f0e8df", text: "#2c1f0f",
  muted: "#9c7c5c", accent: "#c8956c", accentLight: "#fdf3e7", green: "#4a9e6b"
};
const fmt = (n) => `Rp ${Number(n).toLocaleString("id-ID")}`;
const pct = (r, t) => (t > 0 ? Math.min(100, Math.round((r / t) * 100)) : 100);
const CATS = {
  Pernikahan: "💍", Kedukaan: "🕊️", "Rumah Sakit": "🏥",
  Pendidikan: "📚", Kelahiran: "👶", Keagamaan: "🌙",
  Komunitas: "🤝", Darurat: "🚨", Lainnya: "✨"
};
const REACTIONS = ["❤️", "🙏", "🤝", "🌸", "🎉"];
const IMAGES = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=75",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=75",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=75"
];
const EVENTS = [
  { id: "e1", user: "Keluarga Rahmat", city: "Surabaya", avatar: "https://i.pravatar.cc/80?img=32", title: "Pernikahan Putra Kami, Farhan & Nadia", cat: "Pernikahan", story: "Dengan penuh syukur kami mengundang Bapak/Ibu untuk turut mendoakan pernikahan putra kami. Semoga menjadi berkah bagi keluarga besar kami.", img: IMAGES[0], target: 15000000, raised: 8750000, supporters: 43, bank: "BCA 1234567890 a.n. Keluarga Rahmat", reminder: true, reactions: { "❤️": 18, "🙏": 31, "🤝": 7, "🌸": 4, "🎉": 22 } },
  { id: "e2", user: "Keluarga Wahyudi", city: "Semarang", avatar: "https://i.pravatar.cc/80?img=15", title: "Biaya Operasi Mama Tercinta", cat: "Rumah Sakit", story: "Mama kami membutuhkan operasi segera. Kami memohon doa dan dukungan agar Mama mendapatkan perawatan terbaik.", img: IMAGES[1], target: 25000000, raised: 12300000, supporters: 67, bank: "Mandiri 9876543210 a.n. Wahyudi", reminder: false, reactions: { "❤️": 45, "🙏": 58, "🤝": 12, "🌸": 23, "🎉": 2 } },
  { id: "e3", user: "Pak Joko Prasetyo", city: "Solo", avatar: "https://i.pravatar.cc/80?img=22", title: "Beasiswa S1 Putri Kami di UGM", cat: "Pendidikan", story: "Putri kami, Anisa, diterima di UGM jurusan Kedokteran. Ini mimpi kami sekeluarga dan kami memohon dukungan saudara sekalian.", img: IMAGES[2], target: 20000000, raised: 20000000, supporters: 89, bank: "BNI 1122334455 a.n. Joko Prasetyo", reminder: false, reactions: { "❤️": 34, "🙏": 21, "🤝": 45, "🌸": 18, "🎉": 67 } }
];
const NOTIFS = [
  { id: "n1", icon: "🤝", title: "Pengingat Hubungan Baik", msg: "Bapak Rahmat pernah memberikan dukungan untuk acara keluarga Anda. Beliau kini mengadakan acara pernikahan putranya.", time: "2 jam lalu", read: false },
  { id: "n2", icon: "❤️", title: "Dukungan Baru", msg: "Ibu Dewi telah memberikan dukungan dan doa untuk acara Anda.", time: "5 jam lalu", read: false },
  { id: "n3", icon: "📢", title: "Pembaruan Acara", msg: "Keluarga Wahyudi memperbarui kabar terbaru mengenai kondisi Mama mereka.", time: "1 hari lalu", read: true }
];
const USER = { name: "Budi Santoso", city: "Yogyakarta", avatar: "https://i.pravatar.cc/80?img=11" };

// ── SMALL COMPONENTS ──────────────────────────────────────────────────────────
const Avatar = ({ src, name, size = 36 }) => (
  <img src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e8d5c0&color=8b5e3c`} alt={name} className="rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm" style={{ width: size, height: size }} />
);
const ProgressBar = ({ v, color = C.accent }) => (
  <div className="w-full h-2 bg-tali-bg rounded-full overflow-hidden mt-2">
    <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${v}%`, background: color }} />
  </div>
);
const Badge = ({ cat }) => (
  <span className="chip">{CATS[cat] || "✨"} {cat}</span>
);
const Button = ({ children, onClick, className = "", variant = "primary", ...props }) => {
  const base = variant === "primary" ? "btn-primary" : "btn-secondary";
  return <button onClick={onClick} className={`${base} ${className}`} {...props}>{children}</button>;
};

// ── EVENT CARD ────────────────────────────────────────────────────────────────
const EventCard = ({ ev, onOpen, onGive }) => {
  const p = pct(ev.raised, ev.target);
  return (
    <div onClick={() => onOpen(ev)} className="card mb-5 cursor-pointer group active:scale-[0.99] transition-transform">
      {ev.reminder && (
        <div className="bg-amber-50/80 border-b border-amber-200/50 px-4 py-2.5 flex items-center gap-2 text-sm text-amber-700">
          <span>🤝</span> Seseorang dari keluarga ini pernah mendukung acara Anda.
        </div>
      )}
      <div className="relative h-48 overflow-hidden">
        <img src={ev.img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3"><Badge cat={ev.cat} /></div>
        {ev.raised >= ev.target && (
          <div className="absolute top-3 right-3 bg-tali-green text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">✓ Terpenuhi</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <Avatar src={ev.avatar} name={ev.user} size={38} />
          <div>
            <div className="text-sm font-semibold text-tali-text">{ev.user}</div>
            <div className="text-xs text-tali-muted">{ev.city}</div>
          </div>
        </div>
        <h3 className="text-base font-bold text-tali-text mb-2 leading-snug">{ev.title}</h3>
        <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4">{ev.story}</p>
        {ev.target > 0 && (
          <>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-bold text-tali-accent">{fmt(ev.raised)}</span>
              <span className="text-tali-muted">{p}% dari {fmt(ev.target)}</span>
            </div>
            <ProgressBar v={p} />
          </>
        )}
        <div className="mt-3 mb-4 text-sm text-stone-600">
          <strong className="text-tali-text">{ev.supporters}</strong> orang telah memberikan dukungan
        </div>
        <div className="flex gap-3">
          <Button onClick={(e) => { e.stopPropagation(); onGive(ev); }} className="flex-1 py-3">🤲 Berikan Dukungan</Button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://wa.me/?text=${encodeURIComponent(`🙏 ${ev.title}\n\nMohon doa dan dukungan keluarga kami.\nhttps://tali.id/e/${ev.id}`)}`, "_blank");
            }}
            className="w-12 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center active:scale-95 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.76 1-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227  1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297 A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 1 11.821 0 00-3.48-8.413z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ── CONTRIBUTE MODAL ──────────────────────────────────────────────────────────
const GiveModal = ({ ev, onClose, onDone }) => {
  const [step, setStep] = useState(1);
  const [amt, setAmt] = useState("");
  const [name, setName] = useState(USER.name);
  const [msg, setMsg] = useState("");
  const [proof, setProof] = useState("");
  const [err, setErr] = useState({});
  const AMTS = [10000, 25000, 50000, 100000, 250000, 500000];

  const validate = () => {
    const e = {};
    if (!amt || isNaN(+amt) || +amt < 10000) e.amt = "Min Rp10.000";
    if (!name.trim()) e.name = "Wajib diisi";
    if (!proof) e.proof = "Upload bukti";
    return e;
  };
  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErr(e); return; }
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-tali-bg w-full max-w-md rounded-t-3xl max-h-[92vh] overflow-y-auto pb-8 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-center pt-3"><div className="w-10 h-1.5 bg-stone-200 rounded-full" /></div>
        <div className="px-5 pt-4">
          <h2 className="text-lg font-bold text-tali-text">Berikan Dukungan</h2>
          <p className="text-xs text-tali-muted mt-1 mb-4 truncate">{ev.title}</p>
          
          {step === 1 && (
            <>
              <p className="text-sm font-medium text-stone-700 mb-3">Pilih metode pembayaran</p>
              {["QRIS", "Transfer Bank", "GoPay", "Dana", "ShopeePay"].map(m => (
                <button key={m} onClick={() => setStep(2)} className="w-full flex justify-between items-center px-4 py-3.5 bg-white border border-tali-border rounded-2xl mb-2 active:scale-[0.98] transition">
                  <span className="text-sm font-medium">{ { "QRIS": "📷", "Transfer Bank": "🏦", "GoPay": "💚", "Dana": "💙", "ShopeePay": "🟠" }[m] } {m}</span>
                  <span className="text-tali-accent">›</span>
                </button>
              ))}
              <div className="mt-3 bg-tali-accentLight rounded-xl p-3 text-xs text-amber-800 leading-relaxed">🌸 Dukungan sekecil Rp10.000 tetap mewakili rasa peduli dan solidaritas yang nyata.</div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="bg-stone-50 rounded-xl p-3 mb-4 text-sm text-stone-700 font-medium">🏦 {ev.bank}</div>
              <p className="text-sm font-semibold text-stone-700 mb-2">Nominal</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {AMTS.map(a => (
                  <button key={a} onClick={() => setAmt(String(a))} className={`py-2.5 rounded-xl text-xs font-medium transition ${amt === String(a) ? "bg-tali-accent text-white" : "bg-stone-50 text-stone-600"}`}>{fmt(a)}</button>
                ))}
              </div>
              <input value={amt} onChange={e => setAmt(e.target.value)} placeholder="Nominal lain..." className={`w-full px-4 py-3 bg-white border rounded-xl text-sm outline-none mb-1 focus:ring-2 focus:ring-tali-accent/30 ${err.amt ? "border-red-400" : "border-tali-border"}`} />
              {err.amt && <p className="text-xs text-red-500 mb-2">{err.amt}</p>}
              
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama Anda" className={`w-full px-4 py-3 bg-white border rounded-xl text-sm outline-none mb-1 focus:ring-2 focus:ring-tali-accent/30 ${err.name ? "border-red-400" : "border-tali-border"}`} />
              {err.name && <p className="text-xs text-red-500 mb-2">{err.name}</p>}
              
              <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Pesan / doa (opsional)" rows={2} className="w-full px-4 py-3 bg-white border border-tali-border rounded-xl text-sm outline-none resize-none mb-2 focus:ring-2 focus:ring-tali-accent/30" />
              
              <label className={`flex items-center gap-3 border-dashed rounded-xl p-3.5 cursor-pointer mb-1 bg-white transition ${err.proof ? "border-red-400" : "border-tali-accent/40"}`}>
                <span className="text-xl">📎</span>
                <div>
                  <div className="text-sm font-medium text-stone-700">{proof || "Unggah Bukti Transfer"}</div>
                  <div className="text-xs text-tali-muted">Screenshot pembayaran</div>
                </div>
                <input type="file" accept="image/*" onChange={e => { if (e.target.files[0]) setProof(e.target.files[0].name); }} className="hidden" />
              </label>
              {err.proof && <p className="text-xs text-red-500 mb-2">{err.proof}</p>}
              <Button onClick={submit} className="w-full mt-3">Kirim Dukungan 🤲</Button>
            </>
          )}
          {step === 3 && (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🙏</div>
              <h3 className="text-xl font-bold text-tali-text mb-2">Terima Kasih!</h3>
              <p className="text-stone-600 leading-relaxed mb-6 text-sm">Dukungan Bapak/Ibu telah tercatat.<br/><strong className="text-tali-accent">Kehadiran dan kepedulian Anda memiliki makna yang mendalam.</strong></p>
              <Button onClick={() => { onDone(); onClose(); }} className="w-full">Selesai</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── CREATE PAGE ───────────────────────────────────────────────────────────────
const CreatePage = ({ onBack, onDone }) => {
  const [form, setForm] = useState({ title: "", cat: "", story: "", target: "", bank: "" });
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-tali-bg px-6 text-center">
      <div className="text-6xl mb-4">🌸</div>
      <h2 className="text-xl font-bold text-tali-text mb-2">Acara Berhasil Dibuat!</h2>
      <p className="text-stone-600 leading-relaxed mb-6 text-sm">Acara Anda akan segera tampil di feed komunitas. Terima kasih telah mempercayakan momen ini kepada Tali.</p>
      <Button onClick={onDone} className="w-full">Kembali ke Beranda</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-tali-bg">
      <div className="bg-white/80 backdrop-blur-md border-b border-tali-border px-4 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-50 active:scale-90 transition">←</button>
        <h2 className="text-base font-bold text-tali-text">Buat Acara</h2>
      </div>
      <div className="flex px-5 pt-4 gap-2">
        {[1, 2].map(s => <div key={s} className={`flex-1 h-1.5 rounded-full transition ${step >= s ? "bg-tali-accent" : "bg-stone-200"}`} />)}
      </div>
      <div className="px-5 pt-5 pb-24">
        {step === 1 && (
          <>
            <h3 className="text-sm font-semibold text-tali-text mb-3">Informasi Acara</h3>
            <input value={form.title} onChange={set("title")} placeholder="Judul acara..." className="w-full px-4 py-3 bg-white border border-tali-border rounded-xl text-sm outline-none mb-3 focus:ring-2 focus:ring-tali-accent/30" />
            <p className="text-xs font-semibold text-stone-600 mb-2">Kategori</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Object.entries(CATS).map(([c, ic]) => (
                <button key={c} onClick={() => setForm(p => ({ ...p, cat: c }))} className={`flex flex-col items-center p-2.5 rounded-xl text-xs transition border ${form.cat === c ? "bg-tali-accentLight border-tali-accent font-bold" : "bg-stone-50 border-tali-border"}`}>
                  <span className="text-lg mb-1">{ic}</span> {c}
                </button>
              ))}
            </div>
            <textarea value={form.story} onChange={set("story")} placeholder="Ceritakan dengan hangat dan jelas..." rows={3} className="w-full px-4 py-3 bg-white border border-tali-border rounded-xl text-sm outline-none resize-none mb-4 focus:ring-2 focus:ring-tali-accent/30" />
            <Button onClick={() => setStep(2)} className="w-full">Lanjut →</Button>
          </>
        )}
        {step === 2 && (
          <>
            <h3 className="text-sm font-semibold text-tali-text mb-3">Target & Pembayaran</h3>
            <p className="text-xs text-tali-muted mb-1">Target dukungan (opsional)</p>
            <input value={form.target} onChange={set("target")} placeholder="Contoh: 10000000" type="number" className="w-full px-4 py-3 bg-white border border-tali-border rounded-xl text-sm outline-none mb-3 focus:ring-2 focus:ring-tali-accent/30" />
            <p className="text-xs font-semibold text-stone-600 mb-1">Info Rekening Bank</p>
            <input value={form.bank} onChange={set("bank")} placeholder="Bank, No. Rekening, Nama" className="w-full px-4 py-3 bg-white border border-tali-border rounded-xl text-sm outline-none mb-3 focus:ring-2 focus:ring-tali-accent/30" />
            <div className="mt-2 bg-tali-accentLight rounded-xl p-3 text-xs text-amber-800 leading-relaxed mb-4">📋 Platform ini tidak memegang uang. Transfer langsung ke penyelenggara.</div>
            <div className="flex gap-3">
              <Button onClick={() => setStep(1)} variant="secondary" className="flex-1">← Kembali</Button>
              <Button onClick={() => setDone(true)} className="flex-2 flex-[2]">🌸 Terbitkan</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── DETAIL PAGE ───────────────────────────────────────────────────────────────
const DetailPage = ({ ev, onBack, onGive }) => {
  const [cmts, setCmts] = useState([
    { id: 1, user: "Ibu Sari", avatar: "https://i.pravatar.cc/80?img=5", text: "Semoga menjadi berkah. Doa kami selalu menyertai. 🙏" },
    { id: 2, user: "Pak Darmawan", avatar: "https://i.pravatar.cc/80?img=8", text: "Turut berbahagia. Doa terbaik untuk keluarga ini. ❤️" }
  ]);
  const [cmt, setCmt] = useState("");
  const p = pct(ev.raised, ev.target);
  const addCmt = () => { if (!cmt.trim()) return; setCmts(c => [...c, { id: Date.now(), user: USER.name, avatar: USER.avatar, text: cmt }]); setCmt(""); };

  return (
    <div className="min-h-screen bg-tali-bg">
      <div className="relative h-56 overflow-hidden">
        <img src={ev.img} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center active:scale-90 transition">←</button>
        <div className="absolute bottom-4 left-4 right-4">
          <Badge cat={ev.cat} />
          <h2 className="mt-2 text-xl font-bold text-white leading-tight">{ev.title}</h2>
        </div>
      </div>

      <div className="px-4 pt-4 pb-28 space-y-4">
        {ev.reminder && (
          <div className="bg-gradient-to-br from-tali-accentLight to-white/60 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <div className="text-sm font-bold text-amber-700 mb-1">Pengingat Hubungan Baik</div>
              <div className="text-xs text-stone-600 leading-relaxed">Seseorang dari keluarga ini pernah memberikan dukungan kepada acara Anda. Hubungan baik terus terjaga.</div>
            </div>
          </div>
        )}

        <div className="card p-4 flex items-center gap-3">
          <Avatar src={ev.avatar} name={ev.user} size={44} />
          <div>
            <div className="font-bold text-sm text-tali-text">{ev.user}</div>
            <div className="text-xs text-tali-muted">{ev.city} · Penyelenggara</div>
          </div>
        </div>

        {ev.target > 0 && (
          <div className="card p-4">
            <div className="flex justify-between mb-3">
              <div>
                <div className="text-xl font-bold text-tali-accent">{fmt(ev.raised)}</div>
                <div className="text-xs text-tali-muted">dari {fmt(ev.target)}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-tali-text">{ev.supporters}</div>
                <div className="text-xs text-tali-muted">pendukung</div>
              </div>
            </div>
            <ProgressBar v={p} />
            <p className="text-xs text-center text-tali-muted mt-3">🌸 Setiap dukungan, berapapun kecilnya, sangat berarti</p>
          </div>
        )}

        <div className="card p-4">
          <h4 className="text-sm font-bold text-tali-text mb-2">Cerita</h4>
          <p className="text-sm text-stone-600 leading-relaxed">{ev.story}</p>
        </div>

        <div className="card p-4">
          <h4 className="text-sm font-bold text-tali-text mb-2">Cara Memberikan Dukungan</h4>
          <div className="bg-stone-50 rounded-lg p-2.5 text-sm text-stone-700 mb-2">🏦 {ev.bank}</div>
          <div className="bg-stone-50 rounded-lg p-2.5 text-sm text-stone-700">📷 QRIS · 💚 GoPay · 💙 Dana · 🟠 ShopeePay</div>
          <p className="text-xs text-tali-muted mt-3">Platform tidak memegang uang. Transfer langsung ke penyelenggara.</p>
        </div>

        <div className="card p-4">
          <h4 className="text-sm font-bold text-tali-text mb-3">Reaksi</h4>
          <div className="flex gap-2 flex-wrap">
            {REACTIONS.map(r => (
              <div key={r} className="bg-stone-50 rounded-full px-3 py-1.5 text-sm text-stone-700 flex items-center gap-1.5">
                {r} <span className="font-medium text-xs">{ev.reactions[r]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h4 className="text-sm font-bold text-tali-text mb-3">Doa & Pesan</h4>
          {cmts.map(c => (
            <div key={c.id} className="flex gap-3 mb-4">
              <Avatar src={c.avatar} name={c.user} />
              <div>
                <div className="text-xs font-bold text-tali-text mb-1">{c.user}</div>
                <p className="text-sm text-stone-600 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-3 pt-3 border-t border-tali-border">
            <input value={cmt} onChange={e => setCmt(e.target.value)} placeholder="Tulis doa atau semangat..." className="flex-1 px-4 py-2.5 bg-white border border-tali-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-tali-accent/30" />
            <button onClick={addCmt} className="bg-tali-accent text-white px-4 rounded-xl text-sm font-medium active:scale-95 transition">Kirim</button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-tali-border px-4 py-3 flex gap-3 z-40">
        <Button onClick={() => onGive(ev)} className="flex-1">🤲 Berikan Dukungan</Button>
        <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`🙏 ${ev.title}\n\nMohon doa dan dukungan keluarga kami.\nhttps://tali.id/e/${ev.id}`)}`, "_blank")} className="w-12 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center active:scale-95 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.76 1-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227  1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297 A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 1 11.821 0 00-3.48-8.413z" /></svg>
        </button>
      </div>
    </div>
  );
};

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
const NotifsPage = ({ notifs, onRead }) => (
  <div className="px-4 pt-5 pb-24">
    <h2 className="text-lg font-bold text-tali-text mb-4">Notifikasi</h2>
    {notifs.map(n => (
      <div key={n.id} onClick={() => onRead(n.id)} className={`rounded-2xl p-4 mb-3 cursor-pointer transition ${n.read ? "bg-white border border-tali-border" : "bg-amber-50 border border-amber-200"}`}>
        <div className="flex gap-3">
          <span className="text-2xl flex-shrink-0">{n.icon}</span>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-tali-text">{n.title}</span>
              {!n.read && <span className="w-2.5 h-2.5 bg-tali-accent rounded-full mt-1 flex-shrink-0" />}
            </div>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">{n.msg}</p>
            <span className="text-[10px] text-tali-muted mt-2 block">{n.time}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ── PROFILE ───────────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const supported = [
    { title: "Biaya RS Keluarga Basuki", name: "Keluarga Basuki", amt: 50000, date: "2025-03-10" },
    { title: "Beasiswa Anak Yatim RT 05", name: "RT 05 Kalibening", amt: 25000, date: "2025-01-22" }
  ];
  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-tali-accent to-amber-300 px-5 py-10 pb-16">
        <h2 className="text-white text-lg font-bold">Profil Saya</h2>
      </div>
      <div className="mx-4 -mt-10 bg-white rounded-3xl border border-tali-border/60 p-5 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <img src={USER.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
          <div>
            <div className="text-lg font-bold text-tali-text">{USER.name}</div>
            <div className="text-xs text-tali-muted">📍 {USER.city}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[["🌸", "2", "Acara Dibuat"], ["🤝", "2", "Partisipasi"], ["❤️", "2", "Momen Dibantu"]].map(([ic, v, l]) => (
            <div key={l} className="bg-stone-50 rounded-2xl p-3 text-center">
              <div className="text-xl mb-1">{ic}</div>
              <div className="text-lg font-bold text-tali-text">{v}</div>
              <div className="text-[10px] text-tali-muted leading-tight">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-5">
        <h3 className="text-sm font-bold text-tali-text mb-3">Riwayat Kepedulian</h3>
        <p className="text-xs text-tali-muted mb-3">Komunitas yang Pernah Anda Dukung</p>
        {supported.map((s, i) => (
          <div key={i} className="card p-4 mb-3">
            <div className="text-sm font-medium text-tali-text mb-1.5">{s.title}</div>
            <div className="flex justify-between">
              <span className="text-xs text-tali-muted">{s.name}</span>
              <span className="text-sm font-bold text-tali-accent">{fmt(s.amt)}</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-1">{s.date}</div>
          </div>
        ))}
        <div className="mt-4 bg-gradient-to-br from-tali-accentLight to-white/60 border border-amber-200 rounded-2xl p-4">
          <h4 className="text-sm font-bold text-amber-800 mb-2">🤝 Memori Silaturahmi</h4>
          <p className="text-xs text-stone-600 leading-relaxed">Platform Tali mengingat setiap kebaikan. Ketika seseorang yang pernah Anda dukung membutuhkan bantuan, Anda akan mendapat pengingat yang hangat dan hormat.</p>
          <p className="text-xs text-amber-700 italic mt-3">"Kebaikan akan selalu diingat."</p>
        </div>
      </div>
    </div>
  );
};

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("feed");
  const [detail, setDetail] = useState(null);
  const [giveEv, setGiveEv] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("Semua");
  const unread = notifs.filter(n => !n.read).length;
  const showToast = m => { setToast(m); setTimeout(() => setToast(null), 3000); };

  if (showCreate) return <div className="max-w-md mx-auto font-sans"><CreatePage onBack={() => setShowCreate(false)} onDone={() => { setShowCreate(false); showToast("Acara berhasil dibuat! 🌸"); }} /></div>;
  if (detail) return <div className="max-w-md mx-auto font-sans"><DetailPage ev={detail} onBack={() => setDetail(null)} onGive={setGiveEv} />{giveEv && <GiveModal ev={giveEv} onClose={() => setGiveEv(null)} onDone={() => showToast("Dukungan tercatat! Terima kasih 🙏")} />}{toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-stone-800 text-white px-5 py-3 rounded-2xl text-sm font-medium z-50 animate-fade-in">{toast}</div>}</div>;

  const filtered = EVENTS.filter(e => filter === "Semua" || e.cat === filter);

  return (
    <div className="max-w-md mx-auto font-sans bg-tali-bg min-h-screen">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-tali-border px-5 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-tali-accent to-amber-300 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-xl font-extrabold text-tali-text tracking-tight">Tali</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setTab("notifs")} className="relative w-10 h-10 flex items-center justify-center rounded-full active:bg-stone-100 transition">
            🔔{unread > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-tali-accent rounded-full text-[9px] text-white flex items-center justify-center font-bold">{unread}</span>}
          </button>
          <Avatar src={USER.avatar} name={USER.name} size={34} />
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {tab === "feed" && (
          <div className="px-4 pt-4">
            <div className="bg-gradient-to-br from-tali-accent to-amber-300 rounded-2xl p-4 mb-4 flex items-center gap-3 shadow-md">
              <span className="text-3xl">🌸</span>
              <div>
                <div className="text-white font-bold text-sm">Selamat datang, {USER.name.split(" ")[0]}</div>
                <div className="text-white/80 text-xs mt-0.5">Kehadiran dan kepedulian Anda memiliki makna.</div>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto hide-scroll pb-3">
              {["Semua", ...Object.keys(CATS)].map(c => (
                <button key={c} onClick={() => setFilter(c)} className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition ${filter === c ? "bg-tali-accent text-white shadow-md" : "bg-white border border-tali-border text-stone-600"}`}>
                  {c === "Semua" ? "✨ Semua" : `${CATS[c]} ${c}`}
                </button>
              ))}
            </div>
            {filtered.map(e => <EventCard key={e.id} ev={e} onOpen={setDetail} onGive={setGiveEv} />)}
          </div>
        )}
        {tab === "notifs" && <NotifsPage notifs={notifs} onRead={id => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x))} />}
        {tab === "profile" && <ProfilePage />}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-tali-border px-2 pt-2 pb-6 flex items-center z-30">
        {[["feed", "🏠", "Beranda"], ["notifs", "🔔", "Notifikasi"], null, ["profile", "👤", "Profil"]].map((t, i) => {
          if (!t) return (
            <div key="create" className="flex-1 flex justify-center -mt-6">
              <button onClick={() => setShowCreate(true)} className="w-14 h-14 bg-gradient-to-br from-tali-accent to-amber-300 rounded-full flex items-center justify-center shadow-lg border-4 border-white active:scale-90 transition">
                <span className="text-white text-2xl font-light">+</span>
              </button>
            </div>
          );
          const [id, ic, lb] = t;
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} className="flex-1 flex flex-col items-center gap-1 py-1 active:scale-90 transition">
              <span className={`text-xl ${active ? "opacity-100" : "opacity-40"}`}>{ic}</span>
              <span className={`text-[10px] font-medium ${active ? "text-tali-accent" : "text-tali-muted"}`}>{lb}</span>
            </button>
          );
        })}
      </div>

      {/* Modals & Toast */}
      {giveEv && <GiveModal ev={giveEv} onClose={() => setGiveEv(null)} onDone={() => showToast("Dukungan tercatat! 🙏")} />}
      {toast && <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-stone-800 text-white px-5 py-3 rounded-2xl text-sm font-medium z-50 animate-fade-in">{toast}</div>}
    </div>
  );
}
