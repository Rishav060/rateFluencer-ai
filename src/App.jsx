import { useState, useEffect, useRef } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, CartesianGrid } from "recharts";

const INFLUENCERS = [
  {
    id: 1, name: "Priya Sharma", handle: "@priyacreates", platform: "Instagram", avatar: "PS",
    niche: "Tech & Startups", followers: 284000, following: 612, posts: 847,
    avgLikes: 18400, avgComments: 1240, avgShares: 890, avgSaves: 2100, avgViews: 142000,
    postFrequency: 5.2, audienceAge: "22-34", audienceGender: "58% Female",
    engagementRate: 6.49, commentLikeRatio: 0.067, saveRate: 1.48,
    followerGrowthRate: 8.2, contentCategories: ["AI", "Tech", "Career"],
    suspiciousSpikes: false, followerDrops: 1, engagementPods: false,
    growthHistory: [180, 198, 212, 229, 247, 261, 284],
    engagementHistory: [5.8, 6.1, 6.3, 6.2, 6.5, 6.4, 6.49],
    topBrands: ["Adobe", "Notion", "Coursera", "LinkedIn"],
    color: "#7F77DD"
  },
  {
    id: 2, name: "Arjun Mehta", handle: "@arjuntech", platform: "LinkedIn", avatar: "AM",
    niche: "Finance & Investing", followers: 142000, following: 890, posts: 523,
    avgLikes: 4200, avgComments: 680, avgShares: 1100, avgSaves: 890, avgViews: 68000,
    postFrequency: 3.8, audienceAge: "28-42", audienceGender: "62% Male",
    engagementRate: 4.91, commentLikeRatio: 0.162, saveRate: 1.31,
    followerGrowthRate: 12.1, contentCategories: ["Finance", "Business", "Investing"],
    suspiciousSpikes: false, followerDrops: 0, engagementPods: false,
    growthHistory: [98, 105, 112, 120, 129, 136, 142],
    engagementHistory: [4.2, 4.5, 4.7, 4.8, 4.9, 4.85, 4.91],
    topBrands: ["Zerodha", "Groww", "CFA Institute", "Bloomberg"],
    color: "#1D9E75"
  },
  {
    id: 3, name: "Sneha Kapoor", handle: "@snehalifestyle", platform: "Instagram", avatar: "SK",
    niche: "Lifestyle & Beauty", followers: 891000, following: 2140, posts: 2341,
    avgLikes: 12800, avgComments: 340, avgShares: 210, avgSaves: 1100, avgViews: 89000,
    postFrequency: 6.1, audienceAge: "18-28", audienceGender: "79% Female",
    engagementRate: 1.44, commentLikeRatio: 0.027, saveRate: 0.12,
    followerGrowthRate: 1.2, contentCategories: ["Beauty", "Fashion", "Lifestyle"],
    suspiciousSpikes: true, followerDrops: 4, engagementPods: true,
    growthHistory: [860, 862, 868, 871, 878, 884, 891],
    engagementHistory: [2.1, 1.9, 1.7, 1.6, 1.5, 1.47, 1.44],
    topBrands: ["Nykaa", "Mamaearth", "Myntra", "H&M"],
    color: "#D4537E"
  },
  {
    id: 4, name: "Rahul Dev", handle: "@rahulbuilds", platform: "YouTube", avatar: "RD",
    niche: "SaaS & Dev Tools", followers: 67000, following: 234, posts: 312,
    avgLikes: 5100, avgComments: 920, avgShares: 1400, avgSaves: 780, avgViews: 34000,
    postFrequency: 2.1, audienceAge: "24-38", audienceGender: "71% Male",
    engagementRate: 12.24, commentLikeRatio: 0.18, saveRate: 2.3,
    followerGrowthRate: 18.7, contentCategories: ["SaaS", "Dev Tools", "Startups"],
    suspiciousSpikes: false, followerDrops: 0, engagementPods: false,
    growthHistory: [38, 42, 47, 53, 58, 63, 67],
    engagementHistory: [10.1, 11.2, 11.8, 12.0, 12.1, 12.2, 12.24],
    topBrands: ["GitHub", "Vercel", "Supabase", "Railway"],
    color: "#BA7517"
  },
  {
    id: 5, name: "Anika Bose", handle: "@anikacooks", platform: "Instagram", avatar: "AB",
    niche: "Food & Health", followers: 198000, following: 456, posts: 1102,
    avgLikes: 11200, avgComments: 890, avgShares: 670, avgSaves: 3400, avgViews: 98000,
    postFrequency: 4.8, audienceAge: "25-40", audienceGender: "67% Female",
    engagementRate: 8.17, commentLikeRatio: 0.079, saveRate: 1.72,
    followerGrowthRate: 9.4, contentCategories: ["Food", "Health", "Wellness"],
    suspiciousSpikes: false, followerDrops: 1, engagementPods: false,
    growthHistory: [142, 153, 163, 172, 181, 190, 198],
    engagementHistory: [7.2, 7.5, 7.8, 8.0, 8.1, 8.1, 8.17],
    topBrands: ["Cult.fit", "Licious", "BigBasket", "Tata Nutrikorner"],
    color: "#639922"
  }
];

const BRANDS = [
  { name: "Adobe", category: "Tech & Creative", niches: ["Tech", "Design", "AI", "Creative"] },
  { name: "Zerodha", category: "Finance", niches: ["Finance", "Investing", "Business"] },
  { name: "Cult.fit", category: "Health & Wellness", niches: ["Health", "Fitness", "Food", "Wellness"] },
  { name: "Notion", category: "Productivity", niches: ["Tech", "SaaS", "Dev Tools", "Career"] },
  { name: "Nykaa", category: "Beauty", niches: ["Beauty", "Fashion", "Lifestyle"] },
  { name: "GitHub", category: "Dev Tools", niches: ["SaaS", "Dev Tools", "Tech", "Startups"] },
];

function computeAuthenticityScore(inf) {
  let score = 100;
  const er = inf.engagementRate;
  const clr = inf.commentLikeRatio;
  const followerK = inf.followers / 1000;
  const expectedER = followerK < 10 ? 8 : followerK < 100 ? 5 : followerK < 500 ? 3 : 2;
  if (er < expectedER * 0.4) score -= 30;
  else if (er < expectedER * 0.7) score -= 15;
  if (clr < 0.02) score -= 20;
  else if (clr < 0.04) score -= 10;
  if (inf.suspiciousSpikes) score -= 20;
  if (inf.engagementPods) score -= 15;
  score -= inf.followerDrops * 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function computeGrowthScore(inf) {
  let score = 0;
  const gr = inf.followerGrowthRate;
  if (gr >= 15) score += 40;
  else if (gr >= 10) score += 30;
  else if (gr >= 5) score += 20;
  else if (gr >= 2) score += 10;
  const erTrend = inf.engagementHistory[6] - inf.engagementHistory[0];
  if (erTrend > 1) score += 30;
  else if (erTrend > 0.3) score += 20;
  else if (erTrend > 0) score += 10;
  else if (erTrend < -1) score -= 10;
  const consistency = 1 - (Math.max(...inf.engagementHistory) - Math.min(...inf.engagementHistory)) / Math.max(...inf.engagementHistory);
  score += Math.round(consistency * 30);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function computeBrandMatch(inf, brand) {
  const infNiches = [...inf.contentCategories, inf.niche];
  const overlap = brand.niches.filter(n => infNiches.some(i => i.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(i.toLowerCase())));
  const nichematch = Math.min(100, overlap.length * 35);
  const engBonus = Math.min(20, inf.engagementRate * 2);
  const authBonus = computeAuthenticityScore(inf) > 70 ? 10 : 0;
  return Math.min(100, Math.round(nichematch + engBonus + authBonus));
}

function computeRatefluencerScore(inf) {
  const auth = computeAuthenticityScore(inf);
  const growth = computeGrowthScore(inf);
  const engScore = Math.min(100, Math.round(inf.engagementRate * 8));
  const consistency = Math.min(100, Math.round(inf.postFrequency * 12));
  const saveQuality = Math.min(100, Math.round(inf.saveRate * 30));
  const score = (auth * 0.30) + (growth * 0.25) + (engScore * 0.25) + (consistency * 0.10) + (saveQuality * 0.10);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function ScoreBadge({ score, size = "md" }) {
  const color = score >= 80 ? "#1D9E75" : score >= 60 ? "#BA7517" : "#D85A30";
  const bg = score >= 80 ? "#E1F5EE" : score >= 60 ? "#FAEEDA" : "#FAECE7";
  const fs = size === "lg" ? 22 : size === "sm" ? 12 : 15;
  const pad = size === "lg" ? "10px 18px" : size === "sm" ? "3px 8px" : "5px 12px";
  return (
    <span style={{ background: bg, color, fontWeight: 500, fontSize: fs, borderRadius: 20, padding: pad, display: "inline-block", minWidth: size === "lg" ? 60 : 40, textAlign: "center" }}>
      {score}
    </span>
  );
}

function Avatar({ initials, color, size = 40 }) {
  const lightBg = color + "22";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: lightBg, border: `2px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, fontSize: size * 0.35, color, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function MetricCard({ label, value, sub, icon }) {
  return (
    <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "14px 16px", minWidth: 0 }}>
      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>{icon} {label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function InfluencerCard({ inf, onClick, selected }) {
  const rf = computeRatefluencerScore(inf);
  const auth = computeAuthenticityScore(inf);
  const growth = computeGrowthScore(inf);
  const isSelected = selected?.id === inf.id;
  return (
    <div onClick={() => onClick(inf)} style={{ background: "var(--color-background-primary)", border: isSelected ? "2px solid #7F77DD" : "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "16px", cursor: "pointer", transition: "border 0.15s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <Avatar initials={inf.avatar} color={inf.color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{inf.name}</div>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{inf.handle} · {inf.platform}</div>
        </div>
        <ScoreBadge score={rf} />
      </div>
      <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 8 }}>
        <span style={{ background: "var(--color-background-tertiary)", borderRadius: 4, padding: "2px 6px", marginRight: 4 }}>{inf.niche}</span>
        <span>{(inf.followers / 1000).toFixed(0)}K followers</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Authentic</div>
          <ScoreBadge score={auth} size="sm" />
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Growth</div>
          <ScoreBadge score={growth} size="sm" />
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Eng. Rate</div>
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)" }}>{inf.engagementRate}%</span>
        </div>
      </div>
    </div>
  );
}

function InfluencerDetail({ inf }) {
  const rf = computeRatefluencerScore(inf);
  const auth = computeAuthenticityScore(inf);
  const growth = computeGrowthScore(inf);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const growthData = inf.growthHistory.map((v, i) => ({ month: months[i], followers: v }));
  const engData = inf.engagementHistory.map((v, i) => ({ month: months[i], er: v }));
  const radarData = [
    { metric: "Authenticity", value: auth },
    { metric: "Growth", value: growth },
    { metric: "Engagement", value: Math.min(100, Math.round(inf.engagementRate * 8)) },
    { metric: "Consistency", value: Math.min(100, Math.round(inf.postFrequency * 12)) },
    { metric: "Save Quality", value: Math.min(100, Math.round(inf.saveRate * 30)) },
  ];
  const brandMatches = BRANDS.map(b => ({ brand: b.name, score: computeBrandMatch(inf, b) })).sort((a, b) => b.score - a.score);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <Avatar initials={inf.avatar} color={inf.color} size={56} />
        <div>
          <div style={{ fontWeight: 500, fontSize: 18, color: "var(--color-text-primary)" }}>{inf.name}</div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{inf.handle} · {inf.platform} · {inf.niche}</div>
          <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Ratefluencer™ Score</span>
            <ScoreBadge score={rf} size="lg" />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 20 }}>
        <MetricCard label="Followers" value={`${(inf.followers / 1000).toFixed(0)}K`} sub={`+${inf.followerGrowthRate}% MoM`} icon="👥" />
        <MetricCard label="Eng. Rate" value={`${inf.engagementRate}%`} sub="Likes+Comments" icon="📊" />
        <MetricCard label="Authenticity" value={auth} sub={auth >= 80 ? "High trust" : auth >= 60 ? "Moderate" : "⚠ Suspicious"} icon="✅" />
        <MetricCard label="Growth Score" value={growth} sub="Next 90 days" icon="📈" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8 }}>Follower growth (K)</div>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={v => [`${v}K`, "Followers"]} />
                <Line type="monotone" dataKey="followers" stroke={inf.color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8 }}>Engagement rate trend</div>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={v => [`${v}%`, "ER"]} />
                <Line type="monotone" dataKey="er" stroke="#7F77DD" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8 }}>Performance radar</div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9 }} />
                <Radar name="Score" dataKey="value" stroke={inf.color} fill={inf.color} fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8 }}>Brand match scores</div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandMatches} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} />
                <YAxis dataKey="brand" type="category" tick={{ fontSize: 9 }} width={52} />
                <Tooltip />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {brandMatches.map((entry, idx) => (
                    <Cell key={idx} fill={entry.score >= 70 ? "#1D9E75" : entry.score >= 40 ? "#BA7517" : "#D3D1C7"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8 }}>Authenticity analysis</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { label: "Suspicious follower spikes", flag: inf.suspiciousSpikes },
            { label: "Engagement pods detected", flag: inf.engagementPods },
            { label: `${inf.followerDrops} follower drop event${inf.followerDrops !== 1 ? "s" : ""}`, flag: inf.followerDrops > 0 },
            { label: "Organic engagement pattern", flag: !inf.suspiciousSpikes && !inf.engagementPods },
          ].map((item, i) => (
            <span key={i} style={{
              fontSize: 11, padding: "4px 10px", borderRadius: 20,
              background: item.flag && item.label.startsWith("Organic") ? "#E1F5EE" : item.flag ? "#FAECE7" : "#E1F5EE",
              color: item.flag && item.label.startsWith("Organic") ? "#0F6E56" : item.flag ? "#993C1D" : "#0F6E56"
            }}>
              {item.flag && !item.label.startsWith("Organic") ? "⚠ " : "✓ "}{item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const scored = INFLUENCERS.map(inf => ({ ...inf, rfScore: computeRatefluencerScore(inf) })).sort((a, b) => b.rfScore - a.rfScore);
  const avgScore = Math.round(scored.reduce((s, i) => s + i.rfScore, 0) / scored.length);
  const topInf = scored[0];
  const highAuth = scored.filter(i => computeAuthenticityScore(i) >= 80).length;

  const scatterData = INFLUENCERS.map(inf => ({
    name: inf.name.split(" ")[0],
    followers: Math.round(inf.followers / 1000),
    engRate: inf.engagementRate,
    score: computeRatefluencerScore(inf),
    color: inf.color
  }));

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
        <MetricCard label="Influencers analyzed" value={INFLUENCERS.length} sub="Across 3 platforms" icon="🔍" />
        <MetricCard label="Avg Ratefluencer score" value={avgScore} sub="Platform average" icon="⭐" />
        <MetricCard label="High-authenticity" value={highAuth} sub="Score ≥ 80" icon="✅" />
        <MetricCard label="Top score" value={topInf.rfScore} sub={topInf.name} icon="🏆" />
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 10 }}>Followers vs. engagement rate (bubble = Ratefluencer score)</div>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scored}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={n => n.split(" ")[0]} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v, n) => [v, n === "rfScore" ? "Ratefluencer Score" : n]} labelFormatter={l => scored.find(s => s.name === l)?.handle || l} />
              <Bar dataKey="rfScore" radius={[4, 4, 0, 0]}>
                {scored.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 10 }}>Ranking table</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
              {["#", "Creator", "Platform", "Followers", "Eng. Rate", "Authentic", "Growth", "Score"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "var(--color-text-secondary)", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scored.map((inf, idx) => (
              <tr key={inf.id} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                <td style={{ padding: "8px", color: "var(--color-text-tertiary)", fontWeight: 500 }}>{idx + 1}</td>
                <td style={{ padding: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar initials={inf.avatar} color={inf.color} size={26} />
                    <div>
                      <div style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{inf.name}</div>
                      <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{inf.niche}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "8px", color: "var(--color-text-secondary)" }}>{inf.platform}</td>
                <td style={{ padding: "8px", color: "var(--color-text-secondary)" }}>{(inf.followers / 1000).toFixed(0)}K</td>
                <td style={{ padding: "8px", fontWeight: 500, color: "var(--color-text-primary)" }}>{inf.engagementRate}%</td>
                <td style={{ padding: "8px" }}><ScoreBadge score={computeAuthenticityScore(inf)} size="sm" /></td>
                <td style={{ padding: "8px" }}><ScoreBadge score={computeGrowthScore(inf)} size="sm" /></td>
                <td style={{ padding: "8px" }}><ScoreBadge score={inf.rfScore} size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BrandMatchingPage() {
  const [selectedBrand, setSelectedBrand] = useState(BRANDS[0]);
  const matches = INFLUENCERS.map(inf => ({
    ...inf,
    matchScore: computeBrandMatch(inf, selectedBrand),
    rfScore: computeRatefluencerScore(inf)
  })).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8 }}>Select brand</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {BRANDS.map(b => (
            <button key={b.name} onClick={() => setSelectedBrand(b)} style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
              background: selectedBrand.name === b.name ? "#EEEDFE" : "var(--color-background-secondary)",
              color: selectedBrand.name === b.name ? "#534AB7" : "var(--color-text-secondary)",
              border: selectedBrand.name === b.name ? "1px solid #AFA9EC" : "0.5px solid var(--color-border-tertiary)",
              fontWeight: selectedBrand.name === b.name ? 500 : 400
            }}>
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px 16px", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{selectedBrand.name}</div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Category: {selectedBrand.category} · Targeting niches: {selectedBrand.niches.join(", ")}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {matches.map((inf, idx) => (
          <div key={inf.id} style={{
            background: "var(--color-background-primary)", border: idx === 0 ? "2px solid #1D9E75" : "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 14
          }}>
            {idx === 0 && <span style={{ position: "absolute", marginTop: -28, fontSize: 10, background: "#E1F5EE", color: "#0F6E56", padding: "2px 8px", borderRadius: 8 }}>Best match</span>}
            <div style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text-tertiary)", minWidth: 20 }}>#{idx + 1}</div>
            <Avatar initials={inf.avatar} color={inf.color} size={38} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 13 }}>{inf.name} · {inf.handle}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{inf.niche} · {(inf.followers / 1000).toFixed(0)}K followers</div>
            </div>
            <div style={{ textAlign: "center", minWidth: 70 }}>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Brand Match</div>
              <ScoreBadge score={inf.matchScore} size="sm" />
            </div>
            <div style={{ textAlign: "center", minWidth: 70 }}>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Ratefluencer</div>
              <ScoreBadge score={inf.rfScore} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareInfluencersPage() {

  const left = INFLUENCERS.find(i => i.name === "Rahul Dev");
  const right = INFLUENCERS.find(i => i.name === "Sneha Kapoor");

  return (
    <div>

      <h2 style={{ marginBottom: 20 }}>
        ⚔️ Influencer Comparison
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >
        <thead>
          <tr>
            <th>Metric</th>
            <th>{left.name}</th>
            <th>{right.name}</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td>Followers</td>
            <td>{left.followers}</td>
            <td>{right.followers}</td>
          </tr>

          <tr>
            <td>Engagement</td>
            <td>{left.engagementRate}%</td>
            <td>{right.engagementRate}%</td>
          </tr>

          <tr>
            <td>Authenticity</td>
            <td>{computeAuthenticityScore(left)}</td>
            <td>{computeAuthenticityScore(right)}</td>
          </tr>

          <tr>
            <td>Growth</td>
            <td>{computeGrowthScore(left)}</td>
            <td>{computeGrowthScore(right)}</td>
          </tr>

          <tr>
            <td>Ratefluencer Score</td>
            <td>{computeRatefluencerScore(left)}</td>
            <td>{computeRatefluencerScore(right)}</td>
          </tr>

        </tbody>
      </table>

      <div
  style={{
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    background: "#102A43"
  }}
>
  <h3>🏆 Recommended Creator: Rahul Dev</h3>

  <p>✅ 8.5x higher engagement rate</p>
  <p>✅ 65 points higher authenticity</p>
  <p>✅ Strong organic growth</p>
  <p>✅ Lower fraud risk</p>

  <h3 style={{ marginTop: 15 }}>
    Estimated Campaign Outcome
  </h3>

  <p>
    Rahul Dev is likely to deliver higher ROI despite
    having fewer followers.
  </p>
</div>  
    </div>
  );
}

function HiddenGemsPage() {

const gems = INFLUENCERS.map(inf => {


const growth = computeGrowthScore(inf);

const engagement =
  Math.min(100, Math.round(inf.engagementRate * 8));

const followerFactor =
  Math.max(
    0,
    100 - (inf.followers / 10000)
  );

const gemScore =
  Math.round(
    growth * 0.4 +
    engagement * 0.4 +
    followerFactor * 0.2
  );

return {
  ...inf,
  gemScore
};

}).sort((a,b)=>b.gemScore-a.gemScore);

return ( <div>


  <div
    style={{
      background: "linear-gradient(135deg,#0F172A,#1E293B)",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "20px",
      border: "1px solid #334155"
    }}
  >
    <div style={{ fontSize: 22, fontWeight: "bold" }}>
      🏆 Hidden Gem of the Month
    </div>

    <div style={{ marginTop: 10 }}>
      Rahul Dev
    </div>

    <div style={{ marginTop: 6 }}>
      67K Followers • 12.24% Engagement
    </div>

    <div style={{ marginTop: 6 }}>
      Hidden Gem Score: 96
    </div>

    <div style={{ marginTop: 10, color: "#4ADE80" }}>
      Estimated ROI: Very High
    </div>
  </div>

  <h3 style={{ marginBottom: 20 }}>
    🚀 Hidden Gem Discovery
  </h3>

  <div style={{
    display:"flex",
    flexDirection:"column",
    gap:12
  }}>

    {gems.map((inf,index)=>(

      <div
        key={inf.id}
        style={{
          padding:"16px",
          border:"1px solid #ddd",
          borderRadius:"12px"
        }}
      >

        <div style={{
          display:"flex",
          justifyContent:"space-between"
        }}>

          <div>

            <div style={{
              fontWeight:600
            }}>
              #{index+1} {inf.name}
            </div>

            <div style={{
              fontSize:12,
              color:"#777"
            }}>
              {inf.niche}
            </div>

          </div>

          <ScoreBadge score={inf.gemScore} />

        </div>

        <div style={{
          marginTop:10,
          fontSize:12
        }}>
          {inf.gemScore >= 90 &&
            "🚀 Exceptional growth and engagement. High ROI potential."}

          {inf.gemScore >= 70 && inf.gemScore < 90 &&
            "✅ Strong creator with healthy audience quality."}

          {inf.gemScore >= 50 && inf.gemScore < 70 &&
            "📈 Growing creator worth monitoring."}

          {inf.gemScore < 50 &&
            "⚠ Low creator quality signals detected."}
        </div>

      </div>

    ))}

  </div>

</div>


);
}


function AIAnalysisPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedInf, setSelectedInf] = useState(INFLUENCERS[0]);
  const [error, setError] = useState(null);

  async function runAIAnalysis() {
    setLoading(true);
    setError(null);
    setResult(null);
    const inf = selectedInf;
    const auth = computeAuthenticityScore(inf);
    const growth = computeGrowthScore(inf);
    const rf = computeRatefluencerScore(inf);
    const prompt = `You are an expert influencer marketing analyst. Analyze this influencer and provide a concise business intelligence report.

Influencer: ${inf.name} (${inf.handle})
Platform: ${inf.platform}
Niche: ${inf.niche}
Followers: ${inf.followers.toLocaleString()}
Engagement Rate: ${inf.engagementRate}%
Authenticity Score: ${auth}/100
Growth Score: ${growth}/100
Ratefluencer Score: ${rf}/100
Monthly Growth Rate: ${inf.followerGrowthRate}%
Post Frequency: ${inf.postFrequency} posts/week
Suspicious Spikes: ${inf.suspiciousSpikes}
Engagement Pods: ${inf.engagementPods}
Top Brands: ${inf.topBrands.join(", ")}

Provide a JSON response ONLY with these exact keys (no markdown, no preamble):
{
  "summary": "2-sentence executive summary of this influencer's value",
  "strengths": ["strength1", "strength2", "strength3"],
  "risks": ["risk1", "risk2"],
  "recommendation": "Should a brand partner with this creator? One sentence.",
  "idealCampaignType": "Best type of campaign for this creator",
  "estimatedROI": "High/Medium/Low with one reason"
}`;

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await resp.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const clean = text.replace(/json|/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError("AI analysis unavailable in demo mode. Showing mock analysis.");
      setResult({
        summary: `${inf.name} is a ${auth >= 80 ? "highly authentic" : auth >= 60 ? "moderately authentic" : "potentially risky"} creator with ${growth >= 70 ? "strong" : growth >= 40 ? "moderate" : "low"} growth trajectory. Their ${inf.engagementRate}% engagement rate is ${inf.engagementRate > 5 ? "above" : "below"} industry average.`,
        strengths: [`${inf.engagementRate}% engagement rate`, `${inf.followerGrowthRate}% monthly growth`, `Consistent posting cadence`],
        risks: [inf.suspiciousSpikes ? "Suspicious follower spikes detected" : "Minor audience fluctuations", inf.engagementPods ? "Engagement pod activity detected" : "Content category saturation risk"],
        recommendation: rf >= 70 ? `Strong recommendation to partner — high Ratefluencer score of ${rf}.` : `Proceed with caution — moderate score of ${rf}, verify authenticity first.`,
        idealCampaignType: `${inf.niche} product integration with storytelling format`,
        estimatedROI: rf >= 70 ? "High — strong engagement and authentic audience" : "Medium — good reach but verify audience quality"
      });
    }
    setLoading(false);
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8 }}>Select influencer for AI analysis</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {INFLUENCERS.map(inf => (
            <button key={inf.id} onClick={() => { setSelectedInf(inf); setResult(null); }} style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
              background: selectedInf.id === inf.id ? "#EEEDFE" : "var(--color-background-secondary)",
              color: selectedInf.id === inf.id ? "#534AB7" : "var(--color-text-secondary)",
              border: selectedInf.id === inf.id ? "1px solid #AFA9EC" : "0.5px solid var(--color-border-tertiary)",
              fontWeight: selectedInf.id === inf.id ? 500 : 400
            }}>
              {inf.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
        <Avatar initials={selectedInf.avatar} color={selectedInf.color} size={44} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>{selectedInf.name} · {selectedInf.niche}</div>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Ratefluencer Score: <b>{computeRatefluencerScore(selectedInf)}</b> · Authenticity: <b>{computeAuthenticityScore(selectedInf)}</b></div>
        </div>
        <button onClick={runAIAnalysis} disabled={loading} style={{
          padding: "8px 18px", borderRadius: "var(--border-radius-md)", fontSize: 13, cursor: loading ? "not-allowed" : "pointer",
          background: "#EEEDFE", color: "#534AB7", border: "1px solid #AFA9EC", fontWeight: 500
        }}>
          {loading ? "Analyzing…" : "Run AI Analysis ↗"}
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-secondary)", fontSize: 13 }}>
          <div style={{ marginBottom: 8 }}>🤖 AI is analyzing creator profile…</div>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Evaluating authenticity, growth signals, brand fit…</div>
        </div>
      )}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6 }}>Executive summary</div>
            <div style={{ fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.6 }}>{result.summary}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "#E1F5EE", borderRadius: "var(--border-radius-md)", padding: "12px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#0F6E56", marginBottom: 6 }}>✅ Strengths</div>
              {result.strengths.map((s, i) => <div key={i} style={{ fontSize: 12, color: "#085041", marginBottom: 3 }}>· {s}</div>)}
            </div>
            <div style={{ background: "#FAECE7", borderRadius: "var(--border-radius-md)", padding: "12px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#993C1D", marginBottom: 6 }}>⚠ Risks</div>
              {result.risks.map((r, i) => <div key={i} style={{ fontSize: 12, color: "#712B13", marginBottom: 3 }}>· {r}</div>)}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px" }}>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 4 }}>Recommendation</div>
              <div style={{ fontSize: 12, color: "var(--color-text-primary)" }}>{result.recommendation}</div>
            </div>
            <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px" }}>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 4 }}>Ideal campaign</div>
              <div style={{ fontSize: 12, color: "var(--color-text-primary)" }}>{result.idealCampaignType}</div>
            </div>
            <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px" }}>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 4 }}>Estimated ROI</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: result.estimatedROI.startsWith("High") ? "#0F6E56" : result.estimatedROI.startsWith("Medium") ? "#854F0B" : "#993C1D" }}>{result.estimatedROI}</div>
            </div>
          </div>
        </div>
      )}

      {error && !result && (
        <div style={{ background: "#FAEEDA", borderRadius: "var(--border-radius-md)", padding: "10px 14px", fontSize: 12, color: "#633806" }}>{error}</div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  const tabs = [
  { id: "dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
  { id: "influencers", label: "Influencers", icon: "ti-users" },
  { id: "brands", label: "Brand Match", icon: "ti-building-store" },
  { id: "gems", label: "Hidden Gems", icon: "ti-diamond" },
  { id: "ai", label: "AI Analysis", icon: "ti-brain" },
  { id: "compare", label: "Compare", icon: "ti-arrows-left-right" },
];

  return (
    <div style={{ fontFamily: "var(--font-sans)", maxWidth: 900, margin: "0 auto", padding: "0 0 40px" }}>
      <div style={{ padding: "20px 0 16px", borderBottom: "0.5px solid var(--color-border-tertiary)", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⭐</div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 16, color: "var(--color-text-primary)" }}>Ratefluencer AI</div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Influencer Intelligence Engine</div>
            </div>
          </div>
          <button
  onClick={() => {
    setSelectedInfluencer(INFLUENCERS.find(i => i.name === "Sneha Kapoor"));
    setTab("influencers");
  }}
  style={{
    fontSize: 10,
    background: "#E1F5EE",
    color: "#0F6E56",
    padding: "6px 12px",
    borderRadius: 20,
    border: "none",
    cursor: "pointer",
    fontWeight: 500
  }}
>
  LIVE DEMO
</button>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 14 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSelectedInfluencer(null); }} style={{
              padding: "7px 14px", borderRadius: "var(--border-radius-md)", fontSize: 12, cursor: "pointer",
              background: tab === t.id ? "#EEEDFE" : "transparent",
              color: tab === t.id ? "#534AB7" : "var(--color-text-secondary)",
              border: tab === t.id ? "1px solid #AFA9EC" : "0.5px solid transparent",
              fontWeight: tab === t.id ? 500 : 400, display: "flex", alignItems: "center", gap: 6
            }}>
              <i className={`ti ${t.icon}`} style={{ fontSize: 14 }} aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "dashboard" && <Dashboard />}

      {tab === "influencers" && (
        <div style={{ display: "grid", gridTemplateColumns: selectedInfluencer ? "280px 1fr" : "1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {!selectedInfluencer && <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>Click any creator to see full analysis</div>}
            {INFLUENCERS.map(inf => (
              <InfluencerCard key={inf.id} inf={inf} onClick={setSelectedInfluencer} selected={selectedInfluencer} />
            ))}
          </div>
          {selectedInfluencer && (
            <div>
  <div>
    <button>Close</button>
  </div>

  {selectedInfluencer.name === "Sneha Kapoor" && (
  <div
    style={{
      background: "#FFE5E5",
      borderLeft: "5px solid #FF4D4D",
      borderRadius: "8px",
      padding: "12px",
      marginBottom: "12px",
      color: "#8B0000"
    }}
  >
    <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
      🚨 Fraud Alert Detected
    </div>

    <div>Authenticity Score: 35</div>
    <div>Ratefluencer Score: 26</div>

    <ul style={{ marginTop: "8px", paddingLeft: "18px" }}>
      <li>Suspicious follower spikes</li>
      <li>Engagement pod activity detected</li>
      <li>Low engagement for follower count</li>
    </ul>
  </div>
)}

  <InfluencerDetail inf={selectedInfluencer} />
</div>
          )}
        </div>
      )}

      {tab === "brands" && <BrandMatchingPage />}
      {tab === "gems" && <HiddenGemsPage />}
      {tab === "ai" && <AIAnalysisPage />}
      {tab === "compare" && <CompareInfluencersPage />}
      
    </div>
  );
}