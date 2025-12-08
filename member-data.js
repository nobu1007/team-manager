export const DEFAULT_MEMBER_PROFILES = [
  {
    id: 'mem-1',
    name: '佐藤大和',
    role: '班長',
    team: '第1班',
    contact: 'Teams / 内線1234',
    age: 34,
    affiliation: '相模原市消防局 第1班',
    motivation: '仲間全員を安全に家へ帰すことが信条です。冷静な判断と徹底した準備で班を引っ張ります。',
    photo: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    photoAlt: '現場で装備を整える消防隊員'
  },
  {
    id: 'mem-2',
    name: '鈴木陽菜',
    role: 'メディック',
    team: '第2班',
    contact: '携帯 090-xxxx-001',
    age: 29,
    affiliation: '相模原市消防局 医療支援班',
    motivation: '最後の1秒まで諦めない救命処置を心掛けています。受講生の体調管理も任せてください。',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    photoAlt: '救急医療の準備をする隊員'
  },
  {
    id: 'mem-3',
    name: '高橋蓮',
    role: 'ロープ担当',
    team: '第3班',
    contact: 'Teams',
    age: 31,
    affiliation: '相模原市消防局 特別救助隊',
    motivation: 'どんな高所でも最速・最安全でアクセスできるようロープレスキューの技術を磨き続けています。',
    photo: 'https://images.unsplash.com/photo-1524504388940-1e723d76f91c?auto=format&fit=crop&w=600&q=80',
    photoAlt: 'ロープ器具を確認する隊員'
  },
  {
    id: 'mem-4',
    name: '中村翼',
    role: '車両指揮',
    team: '支援隊',
    contact: '内線5678',
    age: 33,
    affiliation: '相模原市消防局 機動支援隊',
    motivation: '車両運用と通信の両面から受講生を支え、どんな状況でも訓練を止めない環境を整えます。',
    photo: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=600&q=80',
    photoAlt: '通信機器を操作する隊員'
  }
];

export function getDefaultMembers() {
  return DEFAULT_MEMBER_PROFILES.map((member) => ({ ...member }));
}


