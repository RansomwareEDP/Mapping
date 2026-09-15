/* ==================================================================
   RANSOMWARE ECOSYSTEM MAP : BRIEFING WALKTHROUGH PACK
   ------------------------------------------------------------------
   A nine-step walkthrough for a senior audience, condensed from the
   22-step teaching script (data/packs/teaching.js). Same facts, same
   sources, no new claims; the difference is pace and framing: every
   step ends on a decision-relevant point, and the whole thing runs in
   under ten minutes on a screen.

   This pack fills the same slot as the teaching pack (MAP_PACKS.teaching)
   so the shell needs no changes; an edition loads one or the other.
   Every figure is carried from the teaching script or the monthly
   record and is dated there.
   ================================================================== */
window.MAP_PACKS = window.MAP_PACKS || {};
MAP_PACKS.teaching = {
  meta: { pack:'briefing', stepCount:9, version:'1', derivedFrom:'teaching.js (22 steps)' },
  series: 'The ecosystem in nine moves',
  tag: 'Briefing',
  steps: [
    {
      title: 'One machine, not many gangs',
      nodes: [],
      tag: 'The system',
      body: 'Ransomware is an industrial supply chain, not a criminal and a laptop. Groups buy access to victim networks, rent infrastructure, hire affiliate teams and use specialist financial services to turn ransom payments into usable cash. Every box on this map is a specialised business that sells to the others. The model has bifurcated: in the second quarter of 2026 the average ransom payment reached $1.88 million, up 176 percent in one quarter, while the median fell to $150,000 and the overall payment rate hit a record low. August 2026 was the highest leak-site month on record, 1,032 claimed victims across more than 80 brands, with 12 brands posting for the first time.',
      callout: 'Read the map left to right: getting in, selling access, running the extortion, cleaning the money, cashing out. The point of the next eight steps is which of those boxes can be re-bought in days and which cannot. That distinction, not the brand names, is where leverage sits.'
    },
    {
      title: 'The protection layer: real, measurable, and out of reach',
      nodes: ['fsb', 'mvd', 'raas'],
      tag: 'State protection',
      body: 'Operators work from Russia under an informal protection model, krysha, meaning roof: shielding in exchange for avoiding Russian targets and occasionally serving the state. That protection can now be measured rather than asserted. When the West issued an arrest warrant, the target was caught 21 times out of 23 in cooperating countries, and 2 times out of 42 against residents of Russia and Belarus. Not one was arrested inside Russia; the only two were caught after they travelled abroad. Same warrants, different airport. The safe harbour is selective: Russia\'s own interior ministry detains seven to eight cybercriminals a week and has held one hosting provider\'s leadership in pretrial detention for fifteen months, for a drug market that served Russians. What it does not police is ransomware against foreign victims.',
      callout: 'If the question in the room is whether state sponsorship, not money, is the real centre of gravity: the protection layer is real, and it is unreachable directly. Zero arrests inside Russia is the measurement. The one dependency both readings share is the money, because a state-tolerated operator still has to cash out through rails the West can touch. That is why the rest of this walkthrough follows the money.'
    },
    {
      title: 'The permission layer: who keeps it online',
      nodes: ['enab-transit', 'enab-registry', 'enab-corp', 'bph'],
      tag: 'Western enablement',
      body: 'A bulletproof host owns servers. It does not own the things that make those servers reachable: a transit carrier that announces its routes, a registry that issues its addresses, a formation agent that supplies the company on paper, a payment processor. Almost every firm in that chain is lawful, frequently European, and under no legal obligation to look at what its customer is doing. Five of the seven bulletproof hosts profiled on this site sit behind a Western upstream carrier. No regional registry has ever revoked address space over sanctions, and after one provider was designated, roughly half its address space was reallocated within about twenty four hours. In August 2026 all seven tracked providers were still announcing routes, including one that is both sanctioned and indicted.',
      callout: 'Permission and protection are different mechanisms. Russian tolerance explains why operators are not arrested; Western intermediary law explains why their servers stay online. The last full de-peering of a bulletproof host by its upstream carrier was in 2008. Transit is the only dependency whose removal is instant and simultaneous across every service a host carries.'
    },
    {
      title: 'The franchise: why brands do not matter',
      nodes: ['raas', 'affiliate', 'forums'],
      tag: 'Core operations',
      body: 'The operator builds and maintains the code, the admin panel, the negotiation portal and the leak site. Affiliate teams, hired and vetted on forums, conduct the intrusions for a revenue split, historically around 70/30. The model has fragmented: 115 distinct groups were active across the first seven months of 2026, and roughly half the names on any month\'s top-fifteen list were absent the month before. In June 2026 the top position changed hands not because of enforcement but because a competing brand offered affiliates a 90/10 split after a payout dispute. When the Conti brand dissolved in 2022 within 90 days of its chat leak, the people did not; they formed Black Basta, Royal, Quantum and others, and that continuity runs into brands operating today.',
      callout: 'Destroying a brand relocates its affiliates. Nothing aimed at the platform changes affiliate expected value. The forum layer is the exception on this side of the map: the main recruitment forum seized in January 2026 has stayed dark for more than seven months and its administrator has declined to rebuild.'
    },
    {
      title: 'The broker tell: a thirty-day warning',
      nodes: ['iab', 'stealers'],
      tag: 'Access markets',
      body: 'Initial Access Brokers buy validated network footholds and resell them to ransomware groups. The average price of corporate access fell from roughly $1,427 in early 2023 to about $439 in early 2026, a 69 percent collapse driven by automated pipelines and the flood of infostealer logs, while validated high-value access still commands a premium. The return ratio is extraordinary: brokers received at least $14 million on-chain in 2025 against roughly $820 million in ransomware payments, close to 58 to 1.',
      callout: 'Spikes in money flowing to brokers precede rises in ransom payments and victim leak-site posts by roughly thirty days. It is the single most useful leading indicator available to defenders and enforcement planners, and it is measurable on-chain.'
    },
    {
      title: 'Cleaning the money',
      nodes: ['mixers', 'bridge'],
      tag: 'Financial obfuscation',
      body: 'Ransom paid in Bitcoin is traceable on a public ledger, so operators route proceeds through mixers, cross-chain bridges and privacy coins before cashing out. One mixer processed over $3 billion in criminal proceeds before its 2023 seizure; a European laundering service dismantled in June 2026 had moved roughly EUR 336 million. After every takedown the layer adapts. Total on-chain ransomware payments fell to about $820 million in 2025, down 8 percent, even as claimed attacks rose by half.',
      callout: 'The falling total is real and its cause is contested: better defences and firmer refusal to pay suppress payments, and so does enforcement pressure on this layer. Both are consistent with the same numbers. This map treats the decline as real and its cause as unsettled.'
    },
    {
      title: 'Cash-out: the brands churn, the rail does not',
      nodes: ['otc', 'exchl', 'ruexch', 'a7a5'],
      tag: 'Cash-out',
      body: 'Partially obfuscated cryptocurrency flows to brokers and high-risk exchanges where it becomes spendable currency. The shopfronts churn constantly: SUEX in 2021, Chatex in 2021, Cryptex in 2024, Garantex seized in March 2025, its successor Grinex dark by April 2026. Underneath them sits something that did not churn: a ruble-backed settlement token issued by a Moscow payments firm carried customer balances straight from one seized exchange into its successor and has cleared more than $100 billion in reported turnover. As of August 2026 no successor has consolidated the ruble corridor for four months, the longest gap since 2021.',
      callout: 'The target is the settlement layer, not the shopfront. Designating exchange after exchange while the rail underneath keeps clearing is the clearest example on this map of pressure applied one level too high. The succession void is the widest it has been; it narrows the day a successor reaches critical liquidity.'
    },
    {
      title: 'The lever that worked in twenty-four hours',
      nodes: ['cex', 'exchl', 'mixers'],
      tag: 'Financial chokepoint',
      body: 'In mid-July 2026 the US Treasury designated four cryptocurrency addresses that had received $165 million in stablecoins. The issuer froze $131 million of the balance immediately, taking cumulative freezes against that address set to nearly $475 million. Nothing was seized, no server taken, no arrest made, no foreign government had to cooperate. The value stopped being spendable. In August the same toolkit expanded: wallet-tagged designations of an entire hacker cluster, and the first sector-wide determination covering a national digital-asset sector. Designations now arrive pre-loaded with chain evidence.',
      callout: 'Every other node on this map substitutes when disrupted: hosting re-registers, proxies resell, stealers rebuild, affiliates migrate. The payment layer cannot, because it is the only point in the chain that must touch the regulated financial system. The wallet clusters behind the most prolific operator ever identified are already published with his designation. Designate-then-freeze against ransomware-attributed clusters needs no new investigation and no foreign cooperation.'
    },
    {
      title: 'How fast it heals, and what to hit',
      nodes: ['bph', 'loaders', 'stealers', 'forums', 'ruexch', 'raas'],
      tag: 'Reconstitution',
      body: 'Reconstitution can be timed: the interval between a public action and a dated artifact showing customers had moved to a replacement has a median of about three days across closed cases, and several intervals are zero. But twelve targets, including two major forums, a leak market, a bulletproof hosting group and several sanctioned exchanges, show no reconstitution at all; their clocks are still running as lower bounds. Infrastructure and brands substitute almost immediately. Trust and coordination structures, and the ability to convert value into money, do not.',
      callout: 'This is the centre of gravity the map keeps arriving at from every direction. Actions against things that can be re-bought are absorbed in days. Actions against things that must be re-earned, reputation, trust relationships, and access to the regulated financial system, are the ones still holding months later. The money-flow view puts widths on exactly that dependence.'
    }
  ]
};
